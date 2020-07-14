var country = [];
var incometaxrate = [];
var corptaxrate = [];
var taxburden = [];

d3.csv("taxregion.csv").then(data => {
    console.log(data);
    country = data.map(d => d['Country Name']);
    incometaxrate = data.map(d => d['avg_result']);
    corptaxrate=data.map(d => d['avg_corptax']);
    taxburden= data.map(d=> d['avg_taxburden']);
    region=data.map(d => d['Region']);

    var trace1 = {
        x: region,
        y: incometaxrate,
        type: "bar",
        text: incometaxrate.map(String),
        name: 'Income Tax Rate',
        textposition: 'auto',
        hoverinfo: 'none',
        opacity: 0.5,
        marker: {
            color: 'rgb(158,202,225)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace2 = {
        x: region,
        y: corptaxrate,
        type: 'bar',
        text: corptaxrate.map(String),
        name: 'Corporate Tax Rate',
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgba(58,200,225,.5)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace3 = {
        x: region,
        y: taxburden,
        name: 'Tax Burden % of GDP',
        text: taxburden.map(String),
        type: 'bar',
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgba(58,200,225,.5)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };
    var data = [trace1, trace2, trace3];

    var layout = {
        barmode: 'group',
        title: 'Tax Burden vs Tax Rates in Each Country'
    };

    Plotly.newPlot('bar-plot', data, layout);

});