d3.csv("cleanData.csv").then(function(data) {
    console.log('works');
  });


data.forEach(function(data) {
    data.incometaxrate = +data.incometaxrate;
    data.country = +data.country;
    data.corptaxrate= +data.corptaxrate;
    data.taxburden= +data.taxburden;


var xValue = country;
var yValue = incometaxrate;
var yValue2 = corptaxrate;
 var yValue3= taxburden;

var trace1 = {
  x: xValue,
  y: yValue,
  type: 'bar',
  text: yValue.map(String),
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
  x: xValue,
  y: yValue2,
  type: 'bar',
  text: yValue2.map(String),
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
    x: xValue,
    y: yValue3,
    type: 'bar',
    text: yValue3.map(String),
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