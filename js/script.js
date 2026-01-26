fetch('/data/attributed_ports.geojson')
.then(response => response.json())
.then(data => {
    console.log(data);
})

/* Example from Leaflet Quick Start Guide*/

var map = L.map('map').setView([0, 0], 4);

//add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


map.on('click', onMapClick);