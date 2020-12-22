const fs = require('fs')

let SITE_INFO = [
    {
        amenities: "1,2,3,4",
        numberOfVisits: 3
    },
    {
        amenities: "1,2,3,4",
        numberOfVisits: 3
    },
    {
        amenities: "1,2,3,4",
        numberOfVisits: 3
    }
]

let json = "["
for (let i = 0; i < SITE_INFO.length; i++) {
    json += 
        `
            {"address": "Address ${i}", 
            "amenities": "${SITE_INFO[i].amenities}",
            "name": "MySite${i}",
            "numberOfVisits": ${SITE_INFO[i].numberOfVisits}}
        `
    if (i != SITE_INFO.length - 1) {
        json += ",\n"
    }
}
json += "\n]"

fs.writeFileSync("generatedVisitedLocations.json", json)