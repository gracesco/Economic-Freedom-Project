// Create chart by defining margins for master select #unemployment 
var svg = d3.select("#unemployment"),    
    margin = {top: 20, right: 20, bottom: 30, left: 150},
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
    .range(["#fafa6e", "#2a4858", "#3fb78d", "#008d8c", "#255566"]);


// Read in CSV and define what the column sizes will be from the data   
d3.csv("./Outputs/UnemploymentGDP.csv", function(d, i, columns) {
  for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;
  console.log(data)
  
  // List the subgroups of the data 
  var keys = data.columns.slice(2);

// Sort data and map to the graph 
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
      .attr("height", y.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });						    	

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

// Add a legend     
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
	  .attr("transform", function(d, i) { return "translate(-50," + (500 + i * 20) + ")"; });

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

//add tooltip 
var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");




