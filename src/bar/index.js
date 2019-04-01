import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
import jsonData from '../data/revenues.json';


const margin = { top: 10, bottom: 50, left: 50, right: 10 };
const width = 600;
const height = 400;
const duration = d3.transition().duration(700);
let flag = true;

/**
 * Group to hold the bar chart
 */
const group = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yScale = d3.scaleLinear()
    .range([height, 0]);

const xScale = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

const xAxis = group.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`);
const yAxis = group.append('g')
    .attr('class', 'y axis');

/**
 * Convert string to number
 */
const transform = (data) => {
    return data.map(obj => ({ ...obj, revenue: +obj.revenue, profit: +obj.profit }));
}

/**
 * @desc Update Scale with new value
 * @param data List of revenue
 */
const updateScale = (data) => {
    const value = flag ? 'revenue' : 'profit';
    // Update scale
    xScale.domain(data.map(obj => obj.month));
    yScale.domain([0, d3.max(data, (obj) => obj[value])])

    const xAxisCall = d3.axisBottom(xScale);
    const yAxisCall = d3.axisLeft(yScale);
    xAxis.transition(duration).call(xAxisCall);
    yAxis.transition(duration).call(yAxisCall);
}

const updateRect = (data) => {
    const value = flag ? 'revenue' : 'profit';
    const rects = group.selectAll('rect')
        .data(data, d => d.month)

    rects.exit()
        .attr('fill', 'red')
        .transition(duration)
        .attr('height', 0)
        .attr('y', yScale(0))
        .remove();

    rects.enter()
        .append('rect')
        .attr('fill', 'green')
        .attr('x', d => xScale(d.month))
        .attr('width', xScale.bandwidth)
        .attr('y', yScale(0))
        .attr('height', 0)
            .merge(rects)
            .transition(duration)
            .attr('x', d => xScale(d.month))
            .attr('width', xScale.bandwidth)
            .attr('y', d => yScale(d[value]))
            .attr('height', d => height - yScale(d[value]))
}

const update = (data) => {
    updateScale(data);
    updateRect(data);
}

const main = () => {
    const revenues = transform(jsonData);

    update(revenues);

    d3.interval(() => {
        let newRevenues = [...revenues];
        const randomIndex = Math.floor(Math.random() * newRevenues.length)
        if (!flag) {
            newRevenues.splice(randomIndex, 1);
        }
        update(newRevenues);
        flag = !flag;

    }, 1000)
}


main();


