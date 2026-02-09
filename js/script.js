let ports;

function FetchPorts(){
fetch('data/attributed_ports.geojson')
.then(response => response.json())
.then(data => {
    ports = data; //assing to var, also used for debugging
    console.log("Ports Fetched!"); //debugging
    console.log(data); //make sure data exists
    DisplayPorts(data); //load map, once data ready
})
.catch(error => console.error('Error:', error)); //catch error
}


var PortMap = L.map('PortMap').setView([0, 0], 2); //create view, zoom level 2



//add tile layer
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { //baselayer
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(PortMap);




function xyflip(coordset){ //flip x and y for leaflet
    return [coordset[1],coordset[0]]
}

ports
function DisplayPorts(ports){ // define function to display the ports


for (let i = 0; i < ports.features.length; i++){

    var circle = L.circle(xyflip(ports.features[i].geometry.coordinates), //make circle, flip coords
        {
        color: 'black', //circle properties
        fillColor: 'rgba(0, 214, 252, 1)',
        fillOpacity: 0.7,    radius: (ports.features[i].properties.outflows) / (400) // base radius on outflow
        }).addTo(PortMap).bindPopup( // popup
            ports.features[i].properties.Name + ", " + ports.features[i].properties.Country +
            " Outflows(TEU): " + Math.round(ports.features[i].properties.outflows) //create labels, janky method
        );

}
}



// Map 2: Choropleth

var Choropleth = L.map('Choropleth').setView([0, 0], 2); //set view

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(Choropleth); //base layer





let countries;
function FetchCountries(){
fetch('https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw/data/countries.geojson') //fetch from online json
.then(response => response.json()) //make sure it json
.then(data => {
    countries = data; //assing to var
    console.log("Countries Fetched!"); //log it!
    console.log(data); //prove data exists 
    DisplayCountries(data); //display, once loaded
    
})

.catch(error => console.error('Error:', error));
console.log(countries); // also testing it exists 
}



// TURF JS SUMMARY STATISTICS
function PortsSummary(ports, countries){
    let testlog = []; // define empty array, will input country + their exports for debugging purposes
    for (let i = 0; i < countries.features.length; i++) //loop through all countries
    {
        var InCountry = turf.pointsWithinPolygon(ports,countries.features[i].geometry);
        
        var sum = 0 //start summing counter
        for(let j = 0; j < InCountry.features.length; j++) // loop through each port for [i]country
        {
            var sum = sum + InCountry.features[j].properties.outflows
        }
        countries.features[i].properties.outflow_sum = sum // assign sum to each country feature
        testlog[i] = (countries.features[i].properties.name + ": " + sum) // output sum for each country to console, for debugging
    }
    console.log("Port outflows summarized by country:")
    console.log(testlog) // cleaner than spitting out all numbers in terminal
}

//define style for display
var maxOutflow = 160320850 //plan was to make color scheme dynamically generate, but not enough time
var breaks = 7
function getColor(d) { //Taken from choropleth tutorial: https://leafletjs.com/examples/choropleth/
    return d > 90000000 ? '#800026' :
           d > 70000000  ? '#BD0026' :
           d > 50000000  ? '#E31A1C' :
           d > 30000000  ? '#FC4E2A' :
           d > 10000000   ? '#FD8D3C' :
           d > 5000000   ? '#FEB24C' :
           d > 1000000  ? '#FED976' :
           d > 1        ? '#FFEDA0':
                  '#e2e2e2'; //no data
}


function ChoroplethPopups(feature,layer){ //technique stolen from: https://webgis.pub/leaflet-geojson.html
layer.bindPopup(feature.properties.name +" Outflow(TEU): " + Math.round(feature.properties.outflow_sum)) //clean up values
} // works much cleaner than for loops

function StyleChoropleth(feature) {
return{
    fillColor: getColor(feature.properties.outflow_sum),
    fillOpacity: 0.7, 
    weight: 0.5,
    opacity:1,
    color: 'black' 
}   
}

function DisplayCountries(countries) {
    PortsSummary(ports,countries);

L.geoJSON(countries, {
    style: StyleChoropleth,
onEachFeature: ChoroplethPopups
}).addTo(Choropleth)
}

//legend//
var legend = L.control({position: 'bottomright'}); //also taken from choropleth tutorial https://leafletjs.com/examples/choropleth/

legend.onAdd = function (Choropleth) {

    var div = L.DomUtil.create('div', 'info legend'),
        outflows = [0,50000, 1000000, 5000000, 10000000, 30000000, 50000000, 70000000, 90000000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < outflows.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(outflows[i] + 1) + '"></i> ' +
            outflows[i] + (outflows[i + 1] ? '&ndash;' + outflows[i + 1] + '<br>' : '+'); //same choropleth tutorial https://leafletjs.com/examples/choropleth/
    }

    return div;
};

legend.addTo(Choropleth);






window.onload = function(){
    console.log("On Load Start");
    
    FetchPorts();
    FetchCountries();
    console.log(ports);
    console.log("On Load End");
}

