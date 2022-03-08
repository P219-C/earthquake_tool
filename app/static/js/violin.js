// For Output format check the original source https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function unpack(rows, key) {
    return rows.map(function(row) {return row[key];});
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * This function plots a violin chart of countries/magnitude
 * @param {*} violinObject 
 */
function violinChart(violinObject, selectedCountry){

    const uniqueCountries = [...new Set(violinObject.map(item => item.CountryCode))];
    // console.log(uniqueCountries)

    var randomCountries = [];
    randomCountries.push(selectedCountry);

    while (randomCountries.length < 5) {

        var randomCountry = uniqueCountries[getRandomInt(uniqueCountries.length)];

        if (randomCountries.includes(randomCountry)) {
            console.log("Country", randomCountry, "already in the list")
        } else {
            randomCountries.push(randomCountry)
        }
        

    }

    var filteredCountries = (violinObject).filter(function(entry){
        return (entry.CountryCode === randomCountries[0] || entry.CountryCode === randomCountries[1] || entry.CountryCode === randomCountries[2] || entry.CountryCode === randomCountries[3] || entry.CountryCode === randomCountries[4]);
    });
    
    // console.log(filteredCountries)

    


    var trace = {
        type: 'violin',
        x: unpack(filteredCountries, 'CountryName'),
        y: unpack(filteredCountries, 'Magnitude'),
        points: 'none',
        box: {
            visible: true
        },
        line: {
            color: 'green',
        },
        meanline: {
            visible: true
        },
        transforms: [{
            type: 'groupby',
            groups: unpack(filteredCountries, 'CountryCode'),
            styles: [
                {target: randomCountries[0], value: {line: {color: 'blue'}}},
                {target: randomCountries[1], value: {line: {color: 'orange'}}},
                {target: randomCountries[2], value: {line: {color: 'green'}}},
                {target: randomCountries[3], value: {line: {color: 'red'}}},
                {target: randomCountries[4], value: {line: {color: 'black'}}}
          ]
         }]
    };

    var data = [trace];

    var layout = {
        title: "Magnitude charts",
        xaxis: {
            title: "COUNTRIES"
        },
        yaxis: {
            zeroline: false,
            title: "MAGNITUDE"
        }
    }

    Plotly.newPlot('violin', data, layout);

};