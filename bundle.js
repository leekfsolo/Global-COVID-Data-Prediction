const svg = d3.select('svg')

const width = document.body.clientWidth;
const height = document.body.clientHeight;
svg
    .attr('width', width)
    .attr('height', height);
const marginLeftGraph = { top: 70, right: width/2+50, bottom: 100, left: 100 };
const innerWidth = width - marginLeftGraph.left - marginLeftGraph.right;
const innerHeight = height - marginLeftGraph.top - marginLeftGraph.bottom;

const render = data => {
    const xValue = d => d.date;
    const xAxisLabel = "Date";
    const yValue = d => d.new_cases;
    const yAxisLabel = "New cases";
    const radius = 5;
    const title = `${yAxisLabel} vs ${xAxisLabel} of China`;
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();
    const g = svg.append('g')
        .attr('transform', `translate(${marginLeftGraph.left},${marginLeftGraph.bottom})`);
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10);
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);
    const nested = d3.nest()
                        .key(d => d.location)
                        .entries(data);
    console.log(nested)
    g.selectAll('.line-path').data(nested)
        .enter()
        .append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d.values));

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG = g.append('g').call(yAxis);
    xAxisG.append('text')
        .attr('class', 'axisText')
        .attr('x', innerWidth / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .text(xAxisLabel);
    yAxisG.append('text')
        .attr('class', 'axisText')
        .attr('x', -innerHeight / 2)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    // const titleLabel = g.append('text')
    //     .text(title)
    //     .attr('x', innerWidth / 2)
    //     .attr('y', -20)
    //     .attr('text-anchor', 'middle')
    //     .attr('class', 'title-label');
}

d3.csv('./dataset/data-7-12-2020/data-7-12-2020.csv').then(data => {
    data.forEach(d => {
        d.new_cases = +d.new_cases;
        d.new_deaths = +d.new_deaths;
        d.total_cases = +d.total_cases;
        d.total_deaths = +d.total_deaths;
        d.weekly_cases = +d.weekly_cases;
        d.weekly_deaths = +d.weekly_deaths;
        d.biweekly_cases = +d.biweekly_cases;
        d.biweekly_deaths = +d.biweekly_deaths;
        d.date = new Date(d.date);
    })
    render(data);
})


const x = document.body.clientWidth;
const y = document.body.clientHeight;
console.log(x);
console.log(y);