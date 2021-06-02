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
    const xScale = d3.scaleLinear();
    const yScale = d3.scalePoint();
}

d3.csv('dataJuly-December.csv').then(data =>{
    data.forEach(d => {
        d.day = +d.day;
        d.month = +d.month;
        d.year = +d.year;
        d.cases = +d.cases;
        d.death = +d.death;
        d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] 
        = +d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'];

    })
    
// Cumulative_number_for_14_days_of_COVID-19_cases_per_100000: "3.86943221"
// cases: "71"
// continentExp: "Asia"
// countriesAndTerritories: "Afghanistan"
// countryterritoryCode: "AFG"
// dateRep: "31/07/2020"
// day: "31"
// deaths: "0"
// geoId: "AF"
// month: "7"
// popData2019: "38041757"
// year: "2020"
    render(data);
})