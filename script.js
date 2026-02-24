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

// function to get permits
async function Permits() {
    
    // get date range
    const range = document.getElementById("DateRange").value;

    // split date range into 2 different variables
    const [start, end] = range.split(" to ");

    startdate = `${start}T00:00:00`;
    enddate = `${end}T23:59:59`;
    
    const query = `SELECT * WHERE issueddate >= '${startdate}' AND issueddate <= '${enddate}'`;
    
    //const url = `https://data.calgary.ca/api/v3/views/c2es-76ed/query.geojson?$where=${encodeURIComponent(valid)}&pageNumber=1&pageSize=10&app_token=7KhC2GawryogXKbvxrR7l58Zd`;
    
    //console.log(url);

    const response = await fetch("https://data.calgary.ca/api/v3/views/c2es-76ed/query.geojson",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": "7KhC2GawryogXKbvxrR7l58Zd"
            },
            body: JSON.stringify({
                query: query
                //where: `issueddate >= '${start}' AND issueddate <= '${end}'`,
            })
        }
    );

    const result = await response.json();

    console.log(result);
    
    L.geoJSON(result).addTo(map);

}