/**
 * This function creates a panel that displays the metadata associated to any sample
 * @param {*} objectPanel 
 */
 function buildPanel(objectPanel){
    var tbody = d3.select("tbody");
    tbody.selectAll("tr").remove()
    // console.log(objectPanel)

    var var_death = parseInt((parseFloat(objectPanel.Population)*1000000)*parseFloat(objectPanel.DeathDisasters)/100000)
    var var_population = parseFloat(objectPanel.Population)*1000000
    tbody.append("tr").text(`Deaths and missing persons due to disasters: ${var_death}`);
    tbody.append("tr").text(`Total population: ${var_population}`);
    tbody.append("tr").text(`% of Deaths and missing persons due to disasters: ${(var_death * 100 / var_population).toPrecision(3)}%`);
    tbody.append("tr").text(`GDP per capita (2017 PPP $): ${objectPanel.GDP_PerCapita}`);

    

};










function earthquakeBar(divBar) {
    d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2010-01-01%2000:00:00&endtime=2020-12-31%2023:59:59&minmagnitude=5&orderby=time-asc").then(data =>{
        // console.log(data);

        var normal_date = []
        data.features.forEach(element => {
            // console.log(element.properties.time)
            var unixTime = element.properties.time;
            var date = new Date(unixTime)
            // console.log(date.toLocaleDateString("en-US"));
            normal_date.push(date.getFullYear());
        });
        // console.log(normal_date)

        // Reduce function to obtain unique values in an array
        const result = normal_date.reduce((total, value) => {
            total[value] = (total[value] || 0) + 1;
            return total;
    }, {});

    // console.log(result);
    // console.log(Object.entries(result));
    // console.log(Object.keys(result));
    // console.log(Object.values(result));
    
        var layer = [
            {
                x: Object.keys(result),
                y: Object.values(result),
                type: "bar"
            }
        ];

        var layout ={
            // title: "Number of earthquakes with magnitude >5"
            xaxis: {
                title: {text: 'YEAR'}
            },
            yaxis: {
                title: {text: 'NUMBER OF EARTHQUAKES (Mw >= 5)'}
            }
        }

        Plotly.newPlot(divBar,layer, layout)
    });
};

// // Function that will determine the color of a country based on the available information
function chooseColor(country_code) {

    var list_cc = ['AO','AL','AR','AG','AU','AT','BF','BZ','BO','BR','BT','CH','CL','CI',
                'CM','CO','KM','CR','CY','DM','EG','ES','EE','FI','FJ','FM','GB','GT','GY','HN',
                'ID','IR','IQ','IT','JM','JO','JP','KZ','KE','KG','KH','KN','KR','KW','LA','LC',
                'LK','MA','MG','MX','ML','MM','MN','MZ','MU','MW','MY','NA','NE','NI','NP','NZ',
                'PK','PA','PE','PH','PG','PY','RU','SD','SN','SB','SL','SV','SI','SZ','TG','TL',
                'TN','TR','TZ','UG','UY','VU'];

    var x = list_cc.includes(country_code);
        // console.log(x, list_cc.includes(country_code))
        switch (x) {
            case true:
                return "green";
            case false:
                return "grey";
            default:
                return "black";
        }
        
};



function earthquakeMap(divMap, lat, lon) {
    // Creating map object
    var myMap = L.map(divMap, {
        center: [lat, lon],
        zoom:2
    });
    
    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY_mapbox
    }).addTo(myMap);
    
    // Use this link to get the geojson data.
    var linkCountries = "../static/data/countries.geojson";

    
    // Grabbing our GeoJSON data..
    d3.json(linkCountries).then(function(countriesLayer) {
        d3.json("/API/countries").then(function(country_data){
            // Creating a GeoJSON layer with the retrieved data
            L.geoJson(countriesLayer, {
                // Passing in our style object
                style: function(feature) {
                    // console.log(countries_data)
                    return {
                        color: "black",
                        // Call the chooseColor function to decide which color to color our country (color based on country)
                        fillColor: chooseColor(feature.properties.iso_a2),
                        fillOpacity: 0.2,
                        weight: 1.0
                    };
                },
                // Called on each feature
                onEachFeature: function(feature, layer) {
                    // Set mouse events to change map styling
                    layer.on({
                    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                        fillOpacity: 0.9
                        });
                    },
                    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                        fillOpacity: 0.5
                        });
                    },
                    // When a feature (country) is clicked, it is enlarged to fit the screen
                    click: function(event) {
                        myMap.fitBounds(event.target.getBounds());
                    }
                    });
                    // Giving each feature a pop-up with information pertinent to it
                    layer.bindPopup("<h1>" + feature.properties.name + "</h1>");
            
                }
            }).addTo(myMap);
        });
    });

    d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2011-01-01%2000:00:00&endtime=2011-12-31%2023:59:59&minmagnitude=5&orderby=time").then(function(earthquakesLayer){

        

        // console.log(earthquakesLayer);

        var heatArray = [];

        for (var i = 0; i < earthquakesLayer.features.length; i++){
            var location = earthquakesLayer.features[i].geometry.coordinates;

            if(typeof location === 'undefined'){
                // Element does not exist
                console.log(location)
            }
            else {
                if(typeof location[0] === 'undefined'){
                    console.log(location[0])
                }
                if(typeof location[1] === 'undefined'){
                    console.log(location[1])
                }
                if(location[0] != null && location[1] != null && location.length == 3){
                    heatArray.push([location[1], location[0]]);
                }
            }
        }
        var heat = L.heatLayer(heatArray, {
            radius: 40,
            blur: 0,
            gradient: {1: 'blue', 1: 'lime', 1: 'red'}
        }).addTo(myMap);

    });    
    
};