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


/* Example from Leaflet Quick Start Guide*/

var PortMap = L.map('PortMap').setView([0, 0], 4);

//add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(PortMap);




function xyflip(coordset){
    return [coordset[1],coordset[0]]
}


function DisplayPorts(){
for (let i = 0; i < ports.features.length; i++){

    var circle = L.circle(xyflip(ports.features[i].geometry.coordinates), 
        {
        color: 'black',
        fillColor: 'rgba(0, 214, 252, 1)',
        fillOpacity: 0.7,    radius: (ports.features[i].properties.outflows) / (400 * PortMap.getZoom())
        }).addTo(PortMap).bindPopup(
            ports.features[i].properties.Name + ", " + ports.features[i].properties.Country
        );

}
}

window.onload = function(){
FetchPorts();
DisplayPorts();
console.log(PortMap.getZoom());
}
