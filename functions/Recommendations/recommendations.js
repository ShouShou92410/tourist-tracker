class Recommendations {
    MIN_CONFIDENCE = 0.5
    MIN_SUPPORT = 3/5
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
        "amenities":"1,2,4,5,6",
        "numberOfVisits":0
     },*/
     {
        "name":"The Birds Nest Guest House",
        "address":"Address Unknown",
        "amenities":"1,2,4,5,6",
        "numberOfVisits":1
     },
     {
        "name":"Smart Camden Inn Hostel",
        "address":"Address Unknown",
        "amenities":"1,3,4,5,7",
        "numberOfVisits":1
     },
     {
        "name":"The Old GunPit",
        "address":"Address Unknown",
        "amenities":"2,3,5,7",
        "numberOfVisits":1
     },
     {
        "name":"Generator London",
        "address":"Address Unknown",
        "amenities":"1,5,6,7",
        "numberOfVisits":1
     },
     {
        "name":"London Backpackers Youth Hostel",
        "address":"Address Unknown",
        "amenities":"1,3,4,7,5",
        "numberOfVisits":1
     }]
     

     /**
      * returns form [{amenities: [item1, ...]}]
      */
    convertSitesToData(sites) {
        sites = this.TEST
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
        console.log(this.apriori(initialCombos, data, this.getUniqueItems(initialCombos)))
    }

    getUniqueItems(itemCombos) {
        return Array.from(itemCombos.reduce((items, itemCombo) => {
            itemCombo.forEach(item => items.add(item))
            return items
        }, new Set()))
    }

    /**
     * Assumes itemCombos already fulfills MIN_CONFIDENCE and MIN_SUPPORT
     * @param itemCombos: [[item1, ...]...], each nested array must be the same size
     */
    apriori(itemCombos, data, uniqueItems) {
        let potentialRelations = []
        itemCombos.forEach(itemCombo1 => {
            uniqueItems.forEach(item=> {
                let newCombo = Array.from(new Set([...itemCombo1, item]))
                if (newCombo.length > itemCombo1.length)
                    potentialRelations.push(newCombo)
            })
        });
        
        potentialRelations = potentialRelations.reduce((nonDuplicates, currentItem) => 
            !nonDuplicates.find(itemCombo => 
                itemCombo.every(item => !!currentItem.find(c => c == item))
            ) ? [...nonDuplicates, currentItem] : nonDuplicates, [])
        
        let filtered = potentialRelations
        .filter(itemCombo => this.clearsSupportAndConfidence(itemCombo, data));
        if (filtered.length > 1) {
            return this.apriori(filtered, data, this.getUniqueItems(filtered))
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
