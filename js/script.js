let ports;

function FetchPorts(){
fetch('data/attributed_ports.geojson')
.then(response => response.json())
.then(data => {
    ports = data;
    console.log("Ports Fetched!");
    console.log(data);
    
})
.catch(error => console.error('Error:', error));
}
window.addEventListener('DOMContentLoaded', function() {
    FetchPorts()
    console.log("fetch ports debug")
});
/* Example from Leaflet Quick Start Guide*/

var PortMap = L.map('PortMap').setView([0, 0], 4);



//add tile layer
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(PortMap);




function xyflip(coordset){
    return [coordset[1],coordset[0]]
}

ports
function DisplayPorts(ports){
for (let i = 0; i < ports.features.length; i++){

    var circle = L.circle(xyflip(ports.features[i].geometry.coordinates), 
        {
        color: 'black',
        fillColor: 'rgba(0, 214, 252, 1)',
        fillOpacity: 0.7,    radius: (ports.features[i].properties.outflows) / (400)
        }).addTo(PortMap).bindPopup(
            ports.features[i].properties.Name + ", " + ports.features[i].properties.Country
        );

}
}

window.onload = function(){
    console.log("working");
    FetchPorts();
    console.log(ports);
    DisplayPorts(ports);
    console.log("last");
}