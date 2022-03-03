function earthquakeMap(divMap, lat, lon) {
    // Creating map object
    var myMap = L.map(divMap, {
        center: [lat, lon],
        zoom:2
    });
    
    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY_mapbox
    }).addTo(myMap);
    
    // Use this link to get the geojson data.
    var link = "../static/data/countries.geojson";

    // Our style object
    var mapStyle = {
        color: "black",
        fillColor: "pink",
        fillOpacity: 0.0,
        weight: 0.25
    };
    
    // Grabbing our GeoJSON data..
    d3.json(link).then(function(data) {
        // Creating a GeoJSON layer with the retrieved data
        L.geoJson(data, {
            // Passing in our style object
            style: mapStyle
        }).addTo(myMap);
    });
};