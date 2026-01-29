function FetchPort(){ fetch('/data/attributed_ports.geojson')
.then(response => response.json())
.finally(response => {
    L.geoJSON(response).addTo(map);
    console.log("Ports Fetched!");
})
}



/* Example from Leaflet Quick Start Guide*/

var map = L.map('map').setView([0, 0], 4);

//add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//L.geoJSON(geojsonFeature).addTo(map);
FetchPort()