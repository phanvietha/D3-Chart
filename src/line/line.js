import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
import jsonData from '../data/coins.json';
import 'webpack-jquery-ui/slider';
import 'webpack-jquery-ui/css';
import { contourDensity } from 'd3';


const margin = { left: 80, right: 100, top: 50, bottom: 100 };
const height = 500 - margin.top - margin.bottom;
const width = 800 - margin.left - margin.right;

const group = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxisCall = d3.axisBottom();
/** Format value above 1000 */
const yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(price => `${parseInt(price)}k`);

const yAxis = group.append('g').attr('class', 'y axis');
const xAxis = group.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${height})`);

// Parse a string to Day Object
const parseTime = d3.timeParse('%d/%m/%Y');
// Parse Date object to String with format 
const formatTime = d3.timeFormat('%d/%m/%Y');

const endDate = parseTime("31/10/2017").getTime();
const startDate = parseTime("12/5/2013").getTime();


let coins;

const duration = () => d3.transition().duration(1000);

// Create a range slider
$("#date-slider").slider({
    min: startDate,
    max: endDate,
    step: 86400000, // One Step mean one Day
    values: [startDate, endDate], // Default value for slider
    range: true, // Not allow range to crossing each other
    slide: (_, ui) => {
        const startDateMs = ui.values[0];
        const endDateMs = ui.values[1];
        // Change Date of text according to Slide position
        $('#startDate').text(formatTime(new Date(startDateMs)));
        $('#endDate').text(formatTime(new Date(endDateMs)));
        // Update Line chart
        update();
    }
});

/**
 * Transform raw data to clean data
 * @param data coin object
 */
const cleanData = (data) => {
    const filteredData = { ...data };
    for (const coin in data) {
        // Filter null price_usd
        filteredData[coin] = data[coin].filter(obj => !(obj["price_usd"] == null));
        filteredData[coin] = filteredData[coin].map(obj => ({
            ...obj,
            price_usd: +obj["price_usd"],
            date: parseTime(obj["date"])
        }));
    }
    return filteredData;
}



const path = group.append('path')
    .attr('class', 'path')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('stroke-width', 1)


const update = () => {
    const sliderValues = $('#date-slider').slider('values');

    const filterCoins = coins.filter(d => ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1])));

    // Update Scale
    xScale.domain(d3.extent(filterCoins, (d) => d.date));
    yScale.domain([d3.min(filterCoins, d => d['price_usd']), d3.max(filterCoins, d => d['price_usd'])]);
    // Update axis with new Scale
    xAxis.transition(duration()).call(xAxisCall.scale(xScale));
    yAxis.transition(duration()).call(yAxisCall.scale(yScale));

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d['price_usd']));


    path.transition(duration()).attr('d', line(filterCoins));




}


const main = () => {
    coins = cleanData(jsonData)['bitcoin'];
    update();
}

main();
