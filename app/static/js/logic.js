earthquakeMap("map", 40, 0)

earthquakeBar("earthquake_year")


d3.json("/API/countries").then((countryData)=>{
    d3.json("/API/countries_earthquakes").then(function(data) {
    
        buildPanel(countryData[0])
        
        violinChart(data, "AO")

        
        // The following part was adapted from https://stackoverflow.com/questions/20780835/putting-the-country-on-drop-down-list-using-d3-via-csv-file
        var dropData = countryData.map((country_id) => {  // Creating an Array of Objects with country names for the drop down menu
            // console.log(country_id)
            return {"value": country_id.CountryName};
        });

        // console.log(dropData)


        var selectTag = d3.select("select");    // Reference to the <select> element
        var options = selectTag.selectAll("option") // Creating a selection of <option> elements
                        .data(dropData)
                        .enter()
                        .append("option");

        options.text(function (d) {return `${d.value}`;}) // Adding the 'value' attribute and the text content of the option element based on the data
                .attr("value", function(d){return d.value});

        // b. Building the Event listener
        d3.select("#selDataset").on("change", () => {
            var selected = d3.select("#selDataset").property("value");  // Extracting the value of the selected <option>
            // console.log(selected)

            
            selectedCountry = countryData.forEach((country) => { // Looping through all the samples
                // console.log(sample.id)
                if (country.CountryName == selected) {                            // Finding and plotting the selected sample
                    buildPanel(country);
                    console.log(country.CountryCode)
                    violinChart(data, country.CountryCode)
                }
            });

        });
    });
});


