const svg = d3.select('svg')

const width = document.body.clientWidth;
const height = document.body.clientHeight;
svg
    .attr('width', width)
    .attr('height', height)
    .style('overflow', 'visible');
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
        .attr('transform', (d, i) => `translate(0, ${i * spacing})`)
    groups.exit().remove();
    groupsEnter.append('circle')
        .attr('r', circleRadius)
        .attr('fill', colorScale);
    groupsEnter.append('text')
        .attr('dy', '0.32em')
        .attr('x', textOffSet)
        .text(d => d);
}

const hover = (svg, path, data) => {
    if ("ontouchstart" in document) svg
        .style("-webkit-tap-highlight-color", "transparent")
        .on("touchmove", moved)
        .on("touchstart", entered)
        .on("touchend", left)
    else svg
        .on("mousemove", moved)
        .on("mouseenter", entered)
        .on("mouseleave", left);

    const dot = svg.append("g")
        .attr("display", "none");

    dot.append("circle")
        .attr("r", 2.5);

    dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);

    function moved(event) {
        event.preventDefault();
        const pointer = d3.pointer(event, this);
        // const xm = x.invert(pointer[0]);
        // const ym = y.invert(pointer[1]);
        // const i = d3.bisectCenter(data.date, xm);
        // const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
        // path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
        // dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
        // dot.select("text").text(s.name);
    }

    function entered() {
        path.style("mix-blend-mode", null).attr("stroke", "#ddd");
        dot.attr("display", null);
    }

    function left() {
        path.style("mix-blend-mode", "multiply").attr("stroke", null);
        dot.attr("display", "none");
    }
}

const render = data => {
    const xValue = d => d.date;
    const xAxisLabel = "Timeline";
    const xTextOffset = 60;
    const yValue = d => d.new_cases;
    const yAxisLabel = "New cases";
    const yTextOffset = 100;
    const colorValue = d => d.location;
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
    
    const nested = d3.group(data, colorValue);
    const path = g.selectAll('.line-path').data(nested)
        .enter()
        .append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d[1]))
        .attr('stroke', d => colorScale(d[0]));
    svg.append('g').call(colorLegend, {
        textOffSet: 30,
        circleRadius: 15,
        colorScale,
        spacing: 80
    })
        .attr('transform', `translate(1280, 250)`)
    
    //svg.call(hover, path, data);
}

d3.csv('./continent_data2.csv').then(data => {
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

