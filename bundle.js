const svg = d3.select('svg')

const width = document.body.clientWidth;
const height = document.body.clientHeight;
svg
    .attr('width', width)
    .attr('height', height);
const marginLeftGraph = {
    top: 80,
    right: 250,
    bottom: 100,
    left: 150
};
const innerWidth = width - marginLeftGraph.left - marginLeftGraph.right;
const innerHeight = height - marginLeftGraph.top - marginLeftGraph.bottom;

const colorLegend = (selection, props) => {
    const {
        textOffSet,
        circleRadius,
        colorScale,
        spacing
    } = props;

    const groups = selection.selectAll('g')
                    .data(colorScale.domain());
    const groupsEnter = groups.enter()
                            .append('g')
                            .attr('class', 'tick');
    groupsEnter.merge(groups)
                .attr('transform', (d, i) => `translate(0, ${i*spacing})`)
                groups.exit().remove();
    groupsEnter.append('circle')
                .attr('r', circleRadius)
                .attr('fill', colorScale);
    groupsEnter.append('text')
                .attr('dy', '0.32em')
                .attr('x', textOffSet)
                .text(d => d);
}

const render = data => {
    const xValue = d => d.date;
    const xAxisLabel = "Timeline";
    const xTextOffset = 60;
    const yValue = d => d.new_cases;
    const yAxisLabel = "New cases";
    const yTextOffset = 100;
    const colorValue = d => d.location;
    // const title = `${yAxisLabel} vs ${xAxisLabel} of China`;
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0])
        .nice();
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const g = svg.append('g')
        .attr('transform', `translate(${marginLeftGraph.left},${marginLeftGraph.bottom})`);
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10);
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG = g.append('g').call(yAxis);
    xAxisG.append('text')
        .attr('class', 'axisText')
        .attr('x', innerWidth / 2)
        .attr('y', xTextOffset)
        .attr('text-anchor', 'middle')
        .text(xAxisLabel);
    yAxisG.append('text')
        .attr('class', 'axisText')
        .attr('x', -innerHeight / 2)
        .attr('y', -yTextOffset)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);
    const lastYValue = d => yValue(d.values[d.values.length-1]);
    const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a,b) => d3.descending(lastYValue(a), lastYValue(b)));
    g.selectAll('.line-path').data(nested)
        .enter()
        .append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key));
    colorScale.domain(nested.map(d => d.key));
    svg.append('g').call(colorLegend, {
        textOffSet: 40,
        circleRadius: 15,
        colorScale,
        spacing: 80
    })
                .attr('transform', `translate(1280, 250)`)
}

d3.csv('./continent_data.csv').then(data => {
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

