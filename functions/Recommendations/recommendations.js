class Recommendations {
    MIN_CONFIDENCE = 0.5
    MIN_SUPPORT = 0.5
    constructor() {}

    TEST =  [/*{
        "name":"HENX Inn Hostel",
        "address":"Address Unknown",
        "amenities":"3,5,27,28,38,50",
        "numberOfVisits":99
     },
     {
        "name":"Central Hotel",
        "address":"Address Unknown",
        "amenities":"60,29,30,28,35,38",
        "numberOfVisits":43
     },
     {
        "name":"London Budget Guesthouse",
        "address":"Address Unknown",
        "amenities":"64,39",
        "numberOfVisits":2
     },
     {
        "name":"City Budget Guesthouse",
        "address":"Address Unknown",
        "amenities":"3,4,38",
        "numberOfVisits":17
     },
     {
        "name":"Kensal Green Backpackers 2",
        "address":"Address Unknown",
        "amenities":"6,7,8,9,10,11,12,13,60,25,35,41,38,39,38,50",
        "numberOfVisits":100
     },
     {
        "name":"Kensal Green Backpackers",
        "address":"Address Unknown",
        "amenities":"10,14,13,32,28,38,42",
        "numberOfVisits":33
     },
     {
        "name":"The Queens Hostel",
        "address":"Address Unknown",
        "amenities":"64,10,26,43,38",
        "numberOfVisits":0
     },
     {
        "name":"Smart Hyde Park Inn Hostel",
        "address":"Address Unknown",
        "amenities":"3,15,68,35,38,39,38,50",
        "numberOfVisits":0
     },
     {
        "name":"Smart Hyde Park View Hostel",
        "address":"Address Unknown",
        "amenities":"3,4,16,15,35,43,38,38,50",
        "numberOfVisits":0
     },
     {
        "name":"The Birds Nest Guest House",
        "address":"Address Unknown",
        "amenities":"3,63,64,7,8,5,17,15,18,9,19,20,12,13,65,60,29,35,38,38",
        "numberOfVisits":0
     },
     {
        "name":"Smart Camden Inn Hostel",
        "address":"Address Unknown",
        "amenities":"3,64,16,15,38,39,38,50",
        "numberOfVisits":0
     },
     {
        "name":"The Old GunPit",
        "address":"Address Unknown",
        "amenities":"1,2,6",
        "numberOfVisits":3
     },
     {
        "name":"Generator London",
        "address":"Address Unknown",
        "amenities":"1,6",
        "numberOfVisits":3
     },*/
     {
        "name":"London Backpackers Youth Hostel",
        "address":"Address Unknown",
        "amenities":"1,2,3",
        "numberOfVisits":3
     }]
     

    convertSitesToData(sites) {
        sites = this.TEST
        /*
        "name":"HENX Inn Hostel",
        "address":"Address Unknown",
        "amenities":"3,5,27,28,38,50",
        "numberOfVisits":99
        */
        let data = []
        sites.forEach(site => {
            for (let i = 0; i < site.numberOfVisits; i++) {
                data.push({
                    amenities: site.amenities.split(",")
                })
        }})
        return data
    }

    /**
     * @param data: [{amenities: [item1, ...]}]
     */
    findRelations(data) {
        let initialCombos = Array.from(data.reduce((set, datum) => {
            datum.amenities.forEach(amenity => set.add(amenity))
            return set
        }, new Set())).map(el => [el])

        initialCombos = initialCombos.filter(combo => this.clearsSupportAndConfidence(combo, data))

        console.log(this.apriori(initialCombos, data))
    }

    /**
     * Assumes itemCombos already fulfills MIN_CONFIDENCE and MIN_SUPPORT
     * @param itemCombos: [[item1, ...]...], each nested array must be the same size
     * @returns List
     */
    apriori(itemCombos, data) {
        let potentialRelations = []
        itemCombos.forEach(itemCombo1 => {
            itemCombos.forEach(itemCombo2 => {
                if (itemCombo1 != itemCombo2) {
                    potentialRelations.push(Array.from(new Set([...itemCombo1, ...itemCombo2])))
                }
            })
        });

        let filtered = potentialRelations.filter(itemCombo => this.clearsSupportAndConfidence(itemCombo, data));
        if (filtered.length > 1) {
            return this.apriori(filtered, data)
        } else if (filtered.length == 1) {
            return filtered
        } else {
            return itemCombos
        }
    }

    clearsSupportAndConfidence(itemCombo, data) {
        //TODO Confidence
        let support = 0
        data.forEach(datum => {
            if (itemCombo.every(comboAmenity => !!datum.amenities.find(amenity => amenity == comboAmenity))) {
                support++
            }
        })
        support /= data.length

        return support >= this.MIN_SUPPORT
    }
}

let test = new Recommendations()
let data = test.convertSitesToData(6)
test.findRelations(data)