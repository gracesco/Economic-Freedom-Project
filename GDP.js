// Create chart by defining margins and
var svg = d3.select("#unemployment"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create a Bandscale (continuous numeric scale for bandwidth) for the y-variable
var y = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05)
    .align(0.1);

//Create a linear scale for the x-variable
var x = d3.scaleLinear()		
    .rangeRound([0, width]);

// Create an ordinal scale (layered scale) using specific colors to determine distribution of data
var z = d3.scaleOrdinal()
    .range(["#00bfff", "#8000ff", "#ff0080"]);

// Read in CSV and define what the column sizes will be from the data
d3.csv("GDPStatsbyRegion.csv", function(d, i, columns) {
  for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;
  console.log(data)

  // List the subgroups of the data (headers)
  var keys = data.columns.slice(1);


  data.sort(function(a, b) { return b.total - a.total; });
  y.domain(data.map(function(d) { return d.Region; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.Region); })
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y));

  g.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")
      .call(d3.axisBottom(x).ticks(null, "s"))
    .append("text")
      .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
	  .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
