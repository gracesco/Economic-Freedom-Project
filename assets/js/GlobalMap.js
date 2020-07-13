var mymap = L.map('mapid').setView([25,0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoibWpjaGVya2Fzc2t5IiwiYSI6ImNrY2R3a3k1bzAwN2Myem13OGtqbmNrNDcifQ.hStuMDzlxeU__t8RATbjkQ"
}).addTo(mymap);

// L.geoJSON(countries).addTo(mymap)
// console.log(countries)

console.log(countries)

// var geojson;
// var practice = "Median_Household_Income_2016.geojson";



// d3.json(geoData, function(data) {
//     console.log(data)
// })


// d3.json("./countries2.json", function (data) {
//     console.log(data)
//     console.log(data.new_features[1].properties.rank)
// })

function getColor(data) {
    color= data < 10  ? '#1ef63f' :
           data < 20  ? '#56ed1a' :
           data < 30  ? '#73e400' :
           data < 40  ? '#89da00' :
           data < 50   ? '#9ad000' :
           data < 60   ? '#a9c600' :
           data < 70   ? '#b7bc00' :
           data < 80   ? '#c2b100' :
           data < 90   ? '#cca500' :
           data < 100   ? '#d59a00' :
           data < 110   ? '#dd8d00' :
           data < 120   ? '#e48100' :
           data < 130   ? '#e97300' :
           data < 140   ? '#ed6500' :
           data < 150   ? '#f05600' :
           data < 160   ? '#f24500' :
           data < 170   ? '#f23215' :
           data < 180   ? '#f11625' :

                      '#1f16f1';
    // console.log(color)
    return(color)
}


//Set colors for map
//Fix country names in df
function style(new_features) {
    return {
        fillColor: getColor(+new_features.properties.rank),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
    };
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110 , 120, 130, 140, 150, 160, 170],
        labels = [];

    div.innerHTML += "<h4>World Rank</h4>";
    div.innerHTML += '<i style="background: #1f16f1"></i><span>No Data</span><br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    // div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' : 'No Data';

    return div;
};

legend.addTo(mymap);

L.geoJson(countries, {style: style}).addTo(mymap);
