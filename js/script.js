fetch('/data/attributed_ports.geojson')
.then(response => response.json())
.then(data => {
    console.log(data);
})