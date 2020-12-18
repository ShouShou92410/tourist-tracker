const fs = require('fs')
const jp = require('jsonpath');
const { isNullOrUndefined } = require('util');

let txtFiles = ["testcancun.json", "testlondon.json", "testorlando.json", "testparis.json", "testrome.json", "testvancouver.json"];
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

let replacements = [
    {type: "Pets", matches: [
        {match: "Pets are allowed", rewrite: "Pets Allowed"},
        {match: "not allowed", rewrite: "Pets Not Allowed"}
    ]},
    {type: "Bathroom", matches: [
        {match: "Toilet", rewrite: "Public Toilets"},
        {match: "Free toiletries", rewrite: "Free Toiletries"}
    ]},
    {type: "Activities", matches: [
        {match: "Movie nights", rewrite: "Movie Nights"},
        {match: "Live sport events (broadcast)", rewrite: "Live Sport Events (broadcast)"},
        {match: "Live music/performance", rewrite: "Live Music"},
        {match: "Happy hour", rewrite: "Happy Hour"},
        {match: "Evening entertainment", rewrite: "Evening Entertainment"},
        {match: "Darts", rewrite: "Darts"},
        {match: "Table tennis", rewrite: "Table Tennis"},
        {match: "Billiards", rewrite: "Billiards"},
        {match: "Games room", rewrite: "Games Room"},
        {match: "Karaoke", rewrite: "Karaoke"},
        {match: "Pub crawls", rewrite: "Pub Crawls"},
        {match: "Walking tours", rewrite: "Walking Tours"},
        {match: "Stand-up comedy", rewrite: "Stand-Up Comedy"},
        {match: "Temporary art galleries", rewrite: "Temporary Art Galleries"},
        {match: "Nightclub/DJ", rewrite: "Nightclub/DJ"},
        {match: "Library", rewrite: "Library"},
        {match: "Tour or class about local culture", rewrite: "Tour of Local Culture"},
    ]},
    {type: "Internet", matches: [
        {match: "Free!", rewrite: "Free Wifi"}
    ]},
    {type: "Parking", matches: [
        {match: "Free", rewrite: "Free Parking"},
        {match: "costs", rewrite: "Paid Parking"},
        {match: "Street parking", rewrite: "Street Parking"},
        {match: "Accessible parking", rewrite: "Accessible Parking"}
    ]},
    {type: "Services", matches: [
        {match: "Currency Exchange", rewrite: "Currency Exchange"},
        {match: "24-hour front desk", rewrite: "24-hour front desk"},
        {match: "Shared lounge/TV area", rewrite: "Shared lounge/TV area"},
        {match: "Lockers", rewrite: "Lockers"},
        {match: "Vending machine", rewrite: "Vending machine"},
        {match: "Packed lunches", rewrite: "Packed lunches"},
        {match: "ATM", rewrite: "ATM"},
        {match: "Pet bowls", rewrite: "Pet bowls"}
    ]},
    {type: "Safety & security", matches: [
        {match: "24-hour security", rewrite: "24-hour security"},
        {match: "CCTV", rewrite: "CCTV"}
    ]},
    {type: "General", matches: [
        {match: "Non-smoking", rewrite: "Non-Smoking"}, 
        {match: "heating", rewrite: "Heating"}, 
        {match: "carpeted", rewrite: "Carpeted"}, 
        {match: "hardwood", rewrite: "Hardwood"}, 
        {match: "adult only", rewrite: "Adult Only"}, 
        {match: "family rooms", rewrite: "Family Rooms"}, 
        {match: "designated smoking area", rewrite: "Designated Smoking Area"}, 
        {match: "shop", rewrite: "Gift Shop"}, 
        {match: "Soundproof rooms", rewrite: "Soundproof Rooms"}, 
        {match: "shuttle service", rewrite: "Shuttle Service"}, 
        {match: "hypoallergenic", rewrite: "Hypoallergenic"}, 
        {match: "air conditioning", rewrite: "Air Conditioning"}
    ]},
    {type: "Safety features", matches: [
        {match: "Access to health care professionals", rewrite: "Access to Health Care Professionals"}
    ]},
    {type: "Physical distancing", matches: [
        {match: "Cashless payment available", rewrite: "Cashless Payment Available"}    
    ]},
    {type: "Languages", matches: [
        {match: "English", rewrite: "Serves in English"},
        {match: "French", rewrite: "Serves in French"},
        {match: "German", rewrite: "Serves in German"},
        {match: "Spanish", rewrite: "Serves in Spanish"},
        {match: "Mandarin", rewrite: "Serves in Mandarin"},
        {match: "Arabic", rewrite: "Serves in Arabic"},
        {match: "Hindi", rewrite: "Serves in Hindi"}
    ]},
    {type: "Food & Drink", matches: [
        {match: "Special diet menus", rewrite: "Special Diet Menus"},
        {match: "Kids meals", rewrite: "Kids Meals"},
        {match: "Bottle of water", rewrite: "Bottle of Water"},
        {match: "Alcohol", rewrite: "Alcohol"},
        {match: "Snacks", rewrite: "Snacks"}
    ]},
    {type: "Outdoors", matches: [
        {match: "Outdoor dining area", rewrite: "Outdoor Dining Area"},
        {match: "garden", rewrite: "Garden"}
    ]},
    {type: "Living Area", matches: [
        {match: "Seating area", rewrite: "Seating Area"}
    ]},
    {type: "Accessibility", matches: [
        {match: "Wheelchair", rewrite: "Wheelchair/Handicap Accessible"},
        {match: "Braille", rewrite: "Visual Aids: Braille"}
    ]},
    {type: "Transport", matches: [
        {match: "Public transport tickets", rewrite: "Public Transport Tickets"}
    ]}
]

txtFiles.forEach(txtFile => {
    let json = JSON.parse(fs.readFileSync(txtFile,'utf8'));
    
    detailTypes.forEach(type => {
        let query = `$..services_offered[?(@.type=='${type}')].value`;
        let typeReplacements = replacements.find(r => {
            return r.type.includes(type)
        })

        if (typeReplacements != null) {
            const matches = typeReplacements.matches
            jp.apply(json, query, (data) => {
                return data.filter(
                    amenity =>  matches.find(match => {
                            return match.match.toUpperCase().includes(amenity.toUpperCase())
                        }) != null
                ).map(amenity => matches.find(match => 
                        match.match.toUpperCase().includes(amenity.toUpperCase())
                    ).rewrite
                )
            });
        }
    })
    jp.apply(json, `$..services_offered`, (data) => data.filter(
            data => data.value.length != 0
        )
    )
    
    console.log(jp.query(json, "$..services_offered"))
    /*detailTypes.forEach(type => {
        let query = `$..services_offered[?(@.type=='${type}')].value`
        console.log(new Set(jp.query(json, query).flat(3)))
        console.log("===================================\n\n\n\n\n")
    })*/

})