class Recommendations {
    MIN_SUPPORT = 0.01 // TODO Honestly should be fluid but let's have it as a constant for now / for ease
    constructor() {}

    /**
     * @param data: [{amenities: [item1, ...]}]
     * @param datumToGenerateConfidenceFrom: [item1, ...]
     */
    findRelations(data) {
        let initialCombos = Array.from(data.reduce((set, datum) => {
            datum.amenities.forEach(amenity => set.add(amenity))
            return set
        }, new Set())).map(el => [el])
        initialCombos = initialCombos.filter(combo => this.clearsSupport(combo, data))
        
       return this.apriori(initialCombos, data, this.getUniqueItems(initialCombos))
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
    apriori(itemCombos, data, uniqueItems, previousCombos = []) {
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
        .filter(itemCombo => this.clearsSupport(itemCombo, data));
        if (filtered.length > 1) {
            previousCombos.push(filtered)
            return this.apriori(filtered, data, this.getUniqueItems(filtered), previousCombos)
        } else if (filtered.length == 1) {
            previousCombos.push(filtered)
            return previousCombos
        } else {
            return previousCombos
        }
    }

    clearsSupport(itemCombo, data) {
        let support = (this.calculateSupport(itemCombo, data))
        return support >= this.MIN_SUPPORT
    }

    calculateConfidence(x, y, data) {
        let xCount = 0, xyCount = 0
        data.forEach(datum => {
            let amenities = datum.amenities
            if (this.findNumberOfMatches(x, amenities) === x.length) {
                xCount++
                if (y.every(yAmenity => !!amenities.find(amenity => amenity === yAmenity))) {
                    xyCount++
                }
            }
        })

        return xyCount/xCount
    }

    calculateSupport(itemCombo, data) {
        let support = 0
        data.forEach(datum => {
            if (itemCombo.every(comboAmenity => !!datum.amenities.find(amenity => amenity == comboAmenity))) {
                support++
            }
        })
        support /= data.length
        return support
    }

    findNumberOfMatches(itemCombo, itemCombo2) {
        let matches = 0
        itemCombo.forEach(item => {
            if (!!itemCombo2.find((item2) => item === item2)) {
                matches++
            }
        })
        return matches
    }

    /**
     * returns itemCombo-itemCombo2
     */
    findDifferences(itemCombo, itemCombo2) {
        if (itemCombo == null) {
            return itemCombo2
        } else if (itemCombo2 == null) {
            return itemCombo
        }
        return itemCombo.reduce((differences, item) => {
            if (!itemCombo2.find(i => i == item)) {
                differences.push(item)
            }
            return differences
        }, [])
    }
}

class TravellerRecommendations extends Recommendations {

    // TEST = {"0SXiK47sxnZLqwVJdzZbvLmpsSp1":{"-MOite0SsPDh4MKsDJx0":{"latestDateVisited":1608257603090,"numberOfVisits":4},"-MOnGyXbvVg--B4r8x3j":{"latestDateVisited":1608257577339,"numberOfVisits":1}},"LWbq3nyRrdgM27qiQUkKjHkQkc82":{"-MOite0SsPDh4MKsDJx0":{"latestDateVisited":1609461562000,"numberOfVisits":4},"-MOnCvxrlcK2MZHyrTeu":{"latestDateVisited":1608251439667,"numberOfVisits":1},"-MOnK9CXgBaexcACfFgq":{"latestDateVisited":1608427047000,"numberOfVisits":1}}}
    convertVisitsToData(visitors) {
        let data = []
        Object.keys(visitors).forEach(visitorKey => {
            data.push({amenities: Object.keys(visitors[visitorKey])})
        })
        return data
    }

    getTravellerRecommendations(rawFirebaseData, userVisitedPlaces) {
        let data = this.convertVisitsToData(rawFirebaseData)
        console.log(userVisitedPlaces)
        let allCombos = this.findRelations(data)

        let highestConfidence = {suggestion: "", value: -1} // Most likely to like
        let highestSupport = {suggestion: "", value: -1} // Most populous
        let highestSupportConfidence = {suggestion: "", value: -1}
        allCombos.forEach(sizedCombos => {
            sizedCombos.forEach(combo => {
                let differences = this.findDifferences(combo, userVisitedPlaces)
                if (differences.length != 0) {
                    let support = this.calculateSupport(combo, data)
                    let confidence = this.calculateConfidence(combo,differences,data)

                    if (support * confidence > highestSupportConfidence.value) {
                        let currentSupportConfidence = support * confidence
                        highestSupportConfidence = {suggestion: differences, value: currentSupportConfidence}
                    }
                    else if (support > highestSupport.value) {
                        highestSupport = {suggestion: differences, value: support}
                    }
                    else if (confidence > highestConfidence.value) {
                        highestConfidence = {suggestion: differences, value: confidence}
                    }
                }
            })
        })

        if (this.findDifferences(highestConfidence?.suggestion, highestSupport?.suggestion).length === 0) {
            highestSupport = null
        }
        if (this.findDifferences(highestSupport?.suggestion, highestSupportConfidence?.suggestion).length === 0 || this.findDifferences(highestSupportConfidence?.suggestion, highestConfidence?.suggestion).length === 0) {
            highestSupportConfidence = null
        }

        return {highestConfidence: highestConfidence, highestSupport: highestSupport, highestSupportConfidence: highestSupportConfidence}
    }
}

class OwnerRecommendations extends Recommendations {
     /**
      * returns form [{amenities: [item1, ...]}]
      */
     convertSitesToData(sites) {
        let data = []
        Object.keys(sites).forEach(siteKey => {
            for (let i = 0; i < sites[siteKey].numberOfVisits; i++) {
                let amenities = sites[siteKey].amenities.split(",")
                if (amenities[0] !== "") {
                    data.push({
                        amenities: amenities
                    })
                }
        }})
        return data
    }

    /**
     * 
     * @param {*} rawFirebaseData
     * @param {*} ownerSite Looks like [1,2,3,4,...]
     */
    getOwnerRecommendations(rawFirebaseData, ownerSite) {
        let data = this.convertSitesToData(rawFirebaseData)
        let allCombos = this.findRelations(data)

        let leastNewAmenities, bestSupportConfidence
        let lowestMatch = 9999, highestMatchSupportConfidence = -1
        let currentSupportConfidence = -1
        allCombos.forEach(sizedCombos => {
            sizedCombos.forEach(combo => {
                let differences = this.findDifferences(combo, ownerSite)
                if (differences.length != 0) {
                    let support = this.calculateSupport(combo, data)
                    let confidence = this.calculateConfidence(combo,differences,data)
                    if ((differences.length < lowestMatch && differences.length != 0) 
                        || (differences.length === lowestMatch && highestMatchSupportConfidence < support * confidence)) {
                        lowestMatch = differences.length
                        leastNewAmenities = combo
                        highestMatchSupportConfidence = support * confidence
                    } else if (support * confidence > currentSupportConfidence) {
                        currentSupportConfidence = support * confidence
                        bestSupportConfidence = {x: combo, y: differences}
                    }
                }
            })
        })

        return [{amenitiesToAdd: this.findDifferences(leastNewAmenities, ownerSite).join(), newVisits: 0}, {amenitiesToAdd: bestSupportConfidence.y.join(), newVisits: 0}]

        /*const res = [
			{ amenitiesToAdd: '1,2,3', newVisits: 45 },
			{ amenitiesToAdd: '1,2,5', newVisits: 20 },
			{ amenitiesToAdd: '1,5,10', newVisits: 36 },
		];*/
    }

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
     },
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
     },*/
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
}

// let test = new OwnerRecommendations()
// let test2 = new TravellerRecommendations()
// console.log(test.findDifferences(["1","2","3","4"], ["2","3","4","5"]))
// console.log(test2.getTravellerRecommendations(test2.TEST, ["-MOite0SsPDh4MKsDJx0"]))
// test.findRelations(data)
module.exports.OwnerRecommendations = OwnerRecommendations
module.exports.TravellerRecommendations = TravellerRecommendations

/**
 * TRAVELLER RECOMMENDATION OUTPUT FORM
 * [{previouslyVisited: "MOite0SsPDh4MKsDJx0",
    recommendation: "MOnCvxrlcK2MZHyrTeu"},
    {previouslyVisited: "MOnEb1BUGWHXo26ziFP",
    recommendation: "MOnCvxrlcK2MZHyrTeu"}]
 */

/*
    Frequent Patterns:
    [1,6] gives you 5 more people
    [2,3,5,7] gives you 10000 more people

    3 different measurements:
    1. least amount of amenities to add (fundamentally flawed: First off, people don't visit tourist spots like the Eifel Tower because of their amenities. Second of all, if we were to assume that people will visit sites )
    2. best support * confidence
    3. best confidence (most likely to generate )
*/