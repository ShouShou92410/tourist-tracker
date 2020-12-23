const fs = require('fs')
const jp = require('jsonpath');

let txtFiles = [ "testcancun.json", "testlondon.json", "testorlando.json", "testparis.json", "testrome.json", "testvancouver.json"];

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
        {match: "Free", rewrite: "Free Wifi"}
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
        {match: "Bottle of water", rewrite: "Bottled Water"},
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

let indexReplacements = {
    "Pets Allowed": {
        label: "Pets Allowed",
        value: 1
    },
    "Pets Not Allowed": {
        label: "Pets Not Allowed",
        value: 2
    },
    "Public Toilets": {
        label: "Public Toilets",
        value: 3
    },
    "Free Toiletries": {
        label: "Free Toiletries",
        value: 4
    },
    "Movie Nights": {
        label: "Movie Nights",
        value: 5
    },
    "Live Sport Events (broadcast)": {
        label: "Live Sport Events (broadcast)",
        value: 6
    },
    "Live Music": {
        label: "Live Music",
        value: 7
    },
    "Happy Hour": {
        label: "Happy Hour",
        value: 8
    },
    "Evening Entertainment": {
        label: "Evening Entertainment",
        value: 9
    },
    "Darts": {
        label: "Darts",
        value: 10
    },
    "Table Tennis": {
        label: "Table Tennis",
        value: 11
    },
    "Billiards": {
        label: "Billiards",
        value: 12
    },
    "Games Room": {
        label: "Games Room",
        value: 13
    },
    "Karaoke": {
        label: "Karaoke",
        value: 14
    },
    "Pub Crawls": {
        label: "Pub Crawls",
        value: 15
    },
    "Walking Tours": {
        label: "Walking Tours",
        value: 16
    },
    "Stand-Up Comedy": {
        label: "Stand-Up Comedy",
        value: 17
    },
    "Temporary Art Galleries": {
        label: "Temporary Art Galleries",
        value: 18
    },
    "Nightclub/DJ": {
        label: "Nightclub/DJ",
        value: 19
    },
    "Library": {
        label: "Library",
        value: 20
    },
    "Tour of Local Culture": {
        label: "Tour of Local Culture",
        value: 21
    },
    "Free Wifi": {
        label: "Free Wifi",
        value: 22
    },
    "Free Parking": {
        label: "Free Parking",
        value: 23
    },
    "Paid Parking": {
        label: "Paid Parking",
        value: 24
    },
    "Street Parking": {
        label: "Street Parking",
        value: 25
    },
    "Accessible Parking": {
        label: "Accessible Parking",
        value: 26
    },
    "Currency Exchange": {
        label: "Currency Exchange",
        value: 27
    },
    "24-hour front desk": {
        label: "24-hour front desk",
        value: 28
    },
    "Shared lounge/TV area": {
        label: "Shared lounge/TV area",
        value: 29
    },
    "Lockers": {
        label: "Lockers",
        value: 30
    },
    "Vending machine": {
        label: "Vending machine",
        value: 31
    },
    "Packed lunches": {
        label: "Packed lunches",
        value: 32
    },
    "ATM": {
        label: "ATM",
        value: 33
    },
    "Pet bowls": {
        label: "Pet bowls",
        value: 34
    },
    "24-hour security": {
        label: "24-hour security",
        value: 35
    },
    "CCTV": {
        label: "CCTV",
        value: 36
    },
    "Non-Smoking": {
        label: "Non-Smoking",
        value: 37
    },
    "Heating": {
        label: "Heating",
        value: 38
    },
    "Carpeted": {
        label: "Carpeted",
        value: 39
    },
    "Hardwood": {
        label: "Hardwood",
        value: 40
    },
    "Adult Only": {
        label: "Adult Only",
        value: 41
    },
    "Family Rooms": {
        label: "Family Rooms",
        value: 42
    },
    "Designated Smoking Area": {
        label: "Designated Smoking Area",
        value: 43
    },
    "Gift Shop": {
        label: "Gift Shop",
        value: 44
    },
    "Soundproof Rooms": {
        label: "Soundproof Rooms",
        value: 45
    },
    "Shuttle Service": {
        label: "Shuttle Service",
        value: 46
    },
    "Hypoallergenic": {
        label: "Hypoallergenic",
        value: 47
    },
    "Air Conditioning": {
        label: "Air Conditioning",
        value: 48
    },
    "Access to Health Care Professionals": {
        label: "Access to Health Care Professionals",
        value: 49
    },
    "Cashless Payment Available": {
        label: "Cashless Payment Available",
        value: 50
    },
    "Serves in English": {
        label: "Serves in English",
        value: 51
    },
    "Serves in French": {
        label: "Serves in French",
        value: 52
    },
    "Serves in German": {
        label: "Serves in German",
        value: 53
    },
    "Serves in Spanish": {
        label: "Serves in Spanish",
        value: 54
    },
    "Serves in Mandarin": {
        label: "Serves in Mandarin",
        value: 55
    },
    "Serves in Arabic": {
        label: "Serves in Arabic",
        value: 56
    },
    "Serves in Hindi": {
        label: "Serves in Hindi",
        value: 57
    },
    "Special Diet Menus": {
        label: "Special Diet Menus",
        value: 58
    },
    "Kids Meals": {
        label: "Kids Meals",
        value: 59
    },
    "Bottled Water": {
        label: "Bottled Water",
        value: 60
    },
    "Alcohol": {
        label: "Alcohol",
        value: 61
    },
    "Snacks": {
        label: "Snacks",
        value: 62
    },
    "Outdoor Dining Area": {
        label: "Outdoor Dining Area",
        value: 63
    },
    "Garden": {
        label: "Garden",
        value: 64
    },
    "Seating Area": {
        label: "Seating Area",
        value: 65
    },
    "Wheelchair/Handicap Accessible": {
        label: "Wheelchair/Handicap Accessible",
        value: 66
    },
    "Visual Aids: Braille": {
        label: "Visual Aids: Braille",
        value: 67
    },
    "Public Transport Tickets": {
        label: "Public Transport Tickets",
        value: 68
    }
}
txtFiles.forEach(txtFile => {
    let json = JSON.parse(fs.readFileSync(txtFile,'utf8'));
    
    detailTypes.forEach(type => {
        let query = `$..services_offered[?(@.type=='${type}')].value`;
        let typeReplacements = replacements.find(r => {
            return r.type == type
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
        } else {
            jp.apply(json, query, (data) => []);
        }
    })

    jp.apply(json, `$..services_offered`, (data) => data.filter(
        data => {
            if (!!replacements.find(r => r.type == data.type)) {
                return {
                    type: data.type, value: []
                }
            }
        }
    ))

    jp.apply(json, `$..services_offered`, (data) => data.filter(
        data => data.value.length != 0
    ))
    
    jp.apply(json, `$..services_offered`, (data) => 
        data.map(service => service.value).flat()
    )

    jp.apply(json, `$..services_offered`, (data) => 
        data.map(service => {
            return indexReplacements[service].value
        })
    )

    json = removeExtraData(json)

    let finalJson = {}
    json.forEach((objs, i) => objs.forEach((obj, j) => finalJson[i + "," + j] = obj))

    fs.writeFileSync("modified_" + txtFile, JSON.stringify(finalJson))
})

function removeExtraData(json) {
    return json.map(data => 
        data.map(location => {
            let newLocation = {
                name: location.name,
                address: "Address Unknown",
                amenities: location.details.services_offered.reduce((total, current, index) => total + (index != 0 ? "," : "") + current, ""),
                numberOfVisits: 0
            }
            return newLocation
        })
    )
}