const fs = require('fs')
const jp = require('jsonpath')

let txtFile = "testlondon.json";
let json = JSON.parse(fs.readFileSync(txtFile,'utf8'));

//console.log(new Set(jp.query(json, '$..neighborhood_structures').flat(3)))

let detailTypes = ['Bathroom',
'Bedroom',
'Room Amenities',
'Pets',
'Activities',
'Internet',
'Parking',
'Services',
'Reception services',
'Safety & security',
'General',
'Safety features',
'Physical distancing',
'Cleanliness & disinfecting',
'Languages spoken',
'Kitchen',
'Food & Drink',
'Outdoors',
'Living Area',
'Entertainment and family services',
'Cleaning services',
'Business facilities',
'Food & drink safety',
'View',
'Accessibility',
'Services & Extras',
'Transport',
'Media & Technology']

detailTypes.forEach(type => {
    console.log(type)
    let query = `$..services_offered[?(@.type=='${type}')].value`
    console.log(new Set(jp.query(json, query).flat(3)))
    console.log("===================================\n\n\n\n\n")
})