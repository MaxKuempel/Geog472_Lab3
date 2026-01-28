function FetchPort(){ fetch('/data/attributed_ports.geojson')
.then(response => response.json())
.then(return data )  
}
/* Example from Leaflet Quick Start Guide*/

var map = L.map('map').setView([0, 0], 4);

//add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [0,0]
    }
};

L.geoJSON(geojsonFeature).addTo(map);

L.geoJSON(FetchPort()).addTo(map);