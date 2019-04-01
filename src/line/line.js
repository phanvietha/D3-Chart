import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
import jsonData from '../data/coins.json';
import 'webpack-jquery-ui/slider';
import 'webpack-jquery-ui/css';


const margin = { left: 80, right: 100, top: 50, bottom: 100 };
const height = 500 - margin.top - margin.bottom;
const width = 800 - margin.left - margin.right;

const group = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxisCall = d3.axisBottom();
/** Format value above 1000 */
const yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(price => `${parseInt(price)}k`);

const yAxis = group.append('g').attr('class', 'y axis');
const xAxis = group.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${height})`);



$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    // slide: function(event, ui){
    //     $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
    //     $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
    //     update();
    // }
});


// const line = d3.line()
//         .x(d => xScale(d.year))
//         .y(d => yScale(d.))

// d3.json("data/example.json").then(function(data) {
//     // Data cleaning
//     data.forEach(function(d) {
//         d.year = parseTime(d.year);
//         d.value = +d.value;
//     });

//     // Set scale domains
//     x.domain(d3.extent(data, function(d) { return d.year; }));
//     y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, 
//         d3.max(data, function(d) { return d.value; }) * 1.005]);

//     // Generate axes once scales have been set
//     xAxis.call(xAxisCall.scale(x))
//     yAxis.call(yAxisCall.scale(y))

//     // Add line to chart
//     g.append("path")
//         .attr("class", "line")
//         .attr("fill", "none")
//         .attr("stroke", "grey")
//         .attr("stroke-with", "3px")
//         .attr("d", line(data));
// });
