const margin = { top: 30, right: 0, bottom: 30, left: 100 },
    width = 720 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

let data;

const render = () => {
    const xValue = d => d.date;
    const yValue = d => d.new_deaths;
    const colorValue = d => d.location;
    const nested = d3.group(data, colorValue);

    const allKeys = data.map(colorValue);

    const svg = d3.select("#my_dataviz")
        .selectAll("uniqueChart")
        .data(nested)
        .join("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleUtc()
        .domain(d3.extent(data, xValue))
        .range([0, width]);
    svg.append('g').call(d3.axisBottom(x)
        .tickSize(-height)
        .tickPadding(10))
        .attr('transform', `translate(0, ${height})`);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([height, 0])
        .nice();
    svg.append('g').call(d3.axisLeft(y)
        .ticks(7)
        .tickSize(-width)
        .tickPadding(15));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(allKeys);

    const lineGenerator = d3.line()
        .x(d => x(xValue(d)))
        .y(d => y(yValue(d)))
        .curve(d3.curveBasis);

    svg.append('path')
        .attr('fill', 'none')
        .attr('d', d => lineGenerator(d[1]))
        .attr('stroke', d => colorScale(d[0]))
        .attr('stroke-width', 3);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -5)
        .attr("x", 0)
        .text(d => d[0])
        .style("fill", d => colorScale(d[0]))
        .attr('transform', `translate(${width / 2}, 0)`)
        .attr('font-size', '20');
}

const chart2020 = () => {
    d3.csv('./continent_data1.csv').then(data1 => {
        data = data1;
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
        });
        render();
    })
}

const chart2021 = () => {
    d3.csv('./continent_data2.csv').then(data1 => {
        data = data1;
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
        });
        render();
    })
}


document.getElementById('2020-btn').addEventListener('click', chart2020);
document.getElementById('2021-btn').addEventListener('click', chart2021);


