const widthMin = 500, heightMin = 500, radiusMin = 250;

const visMin = d3.select("#min-chart").append("svg")
    .attr("width", widthMin)
    .attr("height", heightMin)
    .append("g")
        .attr("transform", "translate(" + widthMin / 2 + "," + heightMin / 2 + ")");

var arcMin = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

var root = d3.hierarchy(JSON)
    .sum(function(d) { return d.Region; });

var partitionMin = d3.partition()
    .size([2 * Math.PI, radiusMin * radiusMin]);

visMin.selectAll("path")
    .data(partitionMin(root).descendants())
    .enter().append("path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arcMin);

const width = document.getElementById("freedoms");
height = 800
radius = Math.min(width, height) / 2;

var positionColors = ["#da1d23", "#ebb40f", "#187a2f", "#0aa3b5", "#c94930", "#ad213e", "#a87b64", "#e65832", "#da0d68"];

var rotationColors = {
    "Region": 5,
    "Country_Name": 10,
    "World_Rank": 15,
    "Ragion_Name": 20,
    "Score2019": 25,
    "Business_Freedom": 30,
    "Labor_Freedom": 35,
    "Monetary_Freedom": 40,
    "Trade_Freedom": 45,
    "Investment_Freedom": 50,
    "Financial_Freedom": 55
};
    
const vis = d3.select("#chart").append("svg")
    .attr("class", "svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
   	.attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
vis.append("defs")
    .attr("id", "defs");
    
d3.text("./freedoms.csv").then(function(raw) {
    let dsv = d3.dsvFormat(';');
    let data = dsv.parse(raw);
    let JSON = buildHierarchy(data);
    addTextElement();
    createVisualization(JSON);
});
function addTextElement() {
  var textGroup = vis.append("g");

  textGroup.append("text")
      .attr("id", "entreprise")
      .attr("y", -100)
      .attr("class", "entreprise")
      .attr("text-anchor", "middle");
  
  textGroup.append("text")
      .attr("id", "type-amount")
      .attr("y", -80)
      .attr("class", "type-amount")
      .attr("text-anchor", "middle");
  textGroup.append("text")
      .attr("id", "category-amount")
      .attr("y", -60)
      .attr("class", "category-amount")
      .attr("text-anchor", "middle");
  textGroup.append("text")
      .attr("id", "amount")
      .attr("class", "amount")
      .attr("text-anchor", "middle");
}
function createVisualization(JSON) {
  var arc = d3.arc()
      .startAngle(function(d) { return d.x0; })
      .endAngle(function(d) { return d.x1; })
      .innerRadius(function(d) { return Math.sqrt(d.y0); })
      .outerRadius(function(d) { return Math.sqrt(d.y1); });
  
  var partition = d3.partition()
     .size([2 * Math.PI, radius * radius]);

  vis.append("circle") // 1
      .attr("r", radius)
      .style("opacity", 0);

  var root = d3.hierarchy(JSON)
      .sum(function(d) { return d.amount; })
      .sort(function(a, b) { // 2
          if (a.depth === 1) {
              return b.value - a.value; 
          } else {
              return b.data.name.localeCompare(a.data.name) * -1;
          }
      });

  var nodes = partition(root).descendants()
      .filter(function(d) { // 3
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.selectAll("path")
      .data(nodes)
      .enter().append("path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .style("fill", function(d) { return getFillValue(d); }) // 4
       .on("mouseover", mouseover); // 5

  d3.select("#chart-container").on("mouseleave", mouseleave); // 5
}
function getFillValue(d) {
  if (d.depth === 1) {
      return positionColors[d.data.position];
  }

  if (d.depth === 2) {
      let parentColor = positionColors[d.parent.data.position];
      let rotateValue = (d.x0 + d.x1) / 2 * 57.29;
      let patternId = d.data.name + d.parent.data.position;

      if (d.data.name == "Avantage") {
          let pattern = d3.select("#defs")
              .append("pattern")
              .attr("id", patternId)
              .attr("width", "8")
              .attr("height", "8")
              .attr("patternUnits", "userSpaceOnUse")
              .attr("patternTransform", "rotate(" + rotateValue + ")");
          pattern.append("rect")
              .attr("width", "4")
              .attr("height", "8")
              .attr("fill", parentColor);
          return "url(#" + patternId +")";
      } else if (d.data.name == "Convention") {
          let pattern = d3.select("#defs")
              .append("pattern")
              .attr("id", patternId)
              .attr("width", "10")
              .attr("height", "10")
              .attr("patternUnits", "userSpaceOnUse");
          pattern.append("circle")
              .attr("r", "5")
              .attr("fill", parentColor);
          return "url(#" + patternId +")";
      } else if (d.data.name == "Rémunération") {
          let pattern = d3.select("#defs")
              .append("pattern")
              .attr("id", patternId)
              .attr("width", "8")
              .attr("height", "8")
              .attr("patternUnits", "userSpaceOnUse")
              .attr("patternTransform", "rotate(" + (rotateValue + 90) + ")");
          pattern.append("rect")
              .attr("width", "1")
              .attr("height", "8")
              .attr("fill", parentColor);
          return "url(#" + patternId +")";
      }
  }

  if (d.depth === 3) {
      let parentColor = d3.hsl(positionColors[d.parent.parent.data.position]);
      parentColor.h += rotationColors[d.data.name];
      return  parentColor + "";
  }

  return "";
}

function mouseover(d) {
  d3.select("#amount")
      .text(d.value.toLocaleString('fr-FR', {minimumFractionDigits: 0, style: 'currency', currency: 'EUR'}));

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // suppression de la racine

  d3.select("#category-amount")
     .text("");
  d3.select("#type-amount")
      .text("");

  sequenceArray.forEach(d => {
      if (d.depth === 1) {
          d3.select("#entreprise")
             .text(d.data.name);
      } else if (d.depth === 2) {
          d3.select("#type-amount")
             .text(d.data.name);
      } else if (d.depth === 3) {
          let text = d.data.name
              .replace("Académies, Fondation, sociétés savantes, organismes de conseils", "Académies, Fondation, ...")
              .replace("Personnes morales assurant la formation initiale ou continue des professionnels de santé", "Personnes morales assurant ...");
           d3.select("#category-amount")
             .text(text);
      }
  });

  d3.selectAll("path") // On grise tous les segments
      .style("opacity", 0.3);

  vis.selectAll("path") // Ensuite on met en valeur uniquement ceux qui sont ancêtres de la sélection
      .filter(function(node) {
          return (sequenceArray.indexOf(node) >= 0);
      })
  .style("opacity", 1);
}

function mouseleave(d) {
  // On désactive la fonction mouseover le temps de la transition
  d3.selectAll("path").on("mouseover", null);

  // Transition pour revenir à l'état d'origine et on remet le mouseover
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .on("end", function() {
          d3.select(this).on("mouseover", mouseover);
      });
}
data.forEach(function(data) {
        data.Region = data.Region;
        data.Country_Name = data.Country_Name;
        data.World_Rank = +data.World_Rank;
        data.Ragion_Name= +data.Ragion_Name;
        data.Score2019= +data.Score2019;
        data.Business_Freedom = +data.Business_Freedom;
        data.Labor_Freedom = +data.Labor_Freedom
        data.Monetary_Freedom = +data.Monetary_Freedom
        data.Trade_Freedom = +data.Trade_Freedom
        data.Investment_Freedom = +data.Investment_Freedom
        data.Financial_Freedom = +data.Financial_Freedom
      
        var layout = {
                margin: {l: 0, r: 0, b: 0, t: 0},
                width: 500,
                height: 500
      };
      
      
      Plotly.newPlot('#freedoms', data, layout)
});