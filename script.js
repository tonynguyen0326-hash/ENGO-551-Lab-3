// create map of city of Calgary
var map = L.map('map').setView([51.04619055613446,-114.06160542305022], 11);

// add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// pick date range
flatpickr('#DateRange', {
    "mode": "range",
    minDate: "1999-06-22",
    maxDate: "today"
});

// variable for all markers
let markers;

// function to get permits
async function Permits() {
    
    // get date range
    const range = document.getElementById("DateRange").value;

    // split date range into 2 different variables
    const [start, end] = range.split(" to ");

    // add start and end times
    const startdate = `${start}T00:00:00`;
    const enddate = `${end}T23:59:59`;
    
    // query from date range
    const query = `SELECT * WHERE issueddate >= '${startdate}' AND issueddate <= '${enddate}'`;

    // use API
    const response = await fetch("https://data.calgary.ca/api/v3/views/c2es-76ed/query.geojson",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": "7KhC2GawryogXKbvxrR7l58Zd"
            },
            body: JSON.stringify({
                query: query
            })
        }
    );

    const result = await response.json();
    
    // remove previous markers, if any
    if (markers) {
        map.removeLayer(markers);
    }

    // add markers with popups 
    markers = L.geoJSON(result, {
        onEachFeature: function(feature, layer) {
            // get properties
            if (feature.properties) {
                const properties = feature.properties;
                const popupContent = `
                Issued Date: ${properties.issueddate || 'N/A'}<br>
                Work Class Group: ${properties.workclassgroup || 'N/A'}<br>
                Contractor Name: ${properties.contractorname || 'N/A'}<br>
                Community Name: ${properties.communityname || 'N/A'}<br>
                Original Address: ${properties.originaladdress || 'N/A'}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);

}