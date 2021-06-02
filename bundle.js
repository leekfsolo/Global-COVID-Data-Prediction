const svg = d3.select('svg')

svg
    .attr('width', 1200)
    .attr('height', 700);

const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 50, right: 50, bottom: 80, left: 150 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const formatDate = (date) => {
    let day = "",
        month = "",
        year = "",
        dashes = 0;
    for (let i = 0; i < date.length; i++) {
        if (dashes === 0) {
            if (date[i] === '/') dashes++;
            else day += date[i];
        }
        else if (dashes === 1) {
            if (date[i] === '/') dashes++;
            else month += date[i];
        }
        else year += date[i];
    }
    const result = month + '/' + day + '/' + year;
    return result;
}

const render = data => {
    const xValue = d => d.dateRep;
    const xAxisLabel = "Days";
    const yValue = d => d.cases;
    const yAxisLabel = "Cases";
    const radius = 5;
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.right})`);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    g.selectAll('circle').data(data)
        .enter()
        .append('circle')
        .attr('cx', d => (xScale(xValue(d))))
        .attr('cy', d => (yScale(yValue(d))))
        .attr('r', radius)
        .attr('fill', 'black')
        .append('title')
        .text(d => d.cases);
    const xAxisG = g.append('g').call(xAxis)
                    .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG = g.append('g').call(yAxis);

}

d3.csv('../data7-12_2020/CN7-12_2020.csv').then(data => {
    data.forEach(d => {
        d.day = +d.day;
        d.month = +d.month;
        d.year = +d.year;
        d.cases = +d.cases;
        d.deaths = +d.deaths;
        d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']
            = +d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'];
        d.dateRep = new Date(formatDate(d.dateRep));
    })
    console.log(data)
    render(data);
})