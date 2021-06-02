const svg = d3.select('svg')

svg
    .attr('width', 1200)
    .attr('height', 700);

const width = +svg.attr('width');
const height = +svg.attr('height');
const padding = { top: 20, right: 20, bottom: 20, left: 20 };
const innerWidth = width - padding.left - padding.right;
const innerHeight = height - padding.top - padding.bottom;
const formatDate = (date) => {
    let day = "", 
        month = "", 
        year = "", 
        dashes = 0;
    for (let i=0 ; i<date.length ; i++) {
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
    const result = month + '/' + month + '/' + year;
    return result;
}

const render = data => {
    const xValue = d => d.cases;
    const xAxisLabel = "Days";
    const yValue = d => d.country;
    const yAxisLabel = "Cases";
    const radius = 8;
    const xScale = d3.scaleLinear()
                    .domain(d3.extent(data, xValue))
                    .range([0, innerWidth]);
    const yScale = d3.scalePoint()
                    .domain(data.map(yValue))
                    .range([0, innerHeight]);
    const g = svg.append('g');

    g.selectAll('circle').data(data)
    .enter()
    .append('circle')
    .attr('cx', d => (xScale(xValue(d))))
    .attr('cy', d => (yScale(yValue(d))))
    .attr('r', radius)
    .attr('fill', 'black');
}

d3.csv('data7-12_2020.csv').then(data =>{
    data.forEach(d => {
        d.day = +d.day;
        d.month = +d.month;
        d.year = +d.year;
        d.cases = +d.cases;
        d.death = +d.death;
        d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] 
        = +d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'];
        d.dateRep = new Date(formatDate(d.dateRep));
    })
    
    render(data);
})