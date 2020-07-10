var country = [];
var incometaxrate= [];
var corptaxrate= [];
var taxburden= [];

Plotly.d3.csv("cleanData.csv", function(kara){ 
    for (var i = 0; i < kara.length; i++) {
      row = kara[i];
      country.push(row['Country Name']);
      incometaxrate.push(row['Income Tax Rate (%)']);
      corptaxrate.push(row['Corporate Tax Rate (%)']);
      taxburden.push(row['Tax Burden % of GDP']);
    }});

    var trace1 = {
      x: country,
      y: incometaxrate,
      type: 'bar',
      text: country.map(String),
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
      x: country,
      y: corptaxrate,
      type: 'bar',
      text: country.map(String),
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
        x: country,
        y: taxburden,
        type: 'bar',
        text: country.map(String),
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
    var data = [trace1,trace2,trace3];
    
    var layout = {
      title: 'Tax Burden vs Tax Rates in Each Country'
    };
    
    Plotly.newPlot('bar-plot', data, layout);