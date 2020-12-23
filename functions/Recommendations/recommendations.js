const MIN_SUPPORT = 0.01; // TODO Honestly should be fluid but let's have it as a constant for now / for ease
class Recommendations {
  constructor() {}
  /**
   * @param data: [{amenities: [item1, ...]}]
   * @param datumToGenerateConfidenceFrom: [item1, ...]
   */
  findRelations(data) {
    let initialCombos = Array.from(
      data.reduce((set, datum) => {
        datum.amenities.forEach((amenity) => set.add(amenity));
        return set;
      }, new Set())
    ).map((el) => [el]);
    initialCombos = initialCombos.filter((combo) =>
      this.clearsSupport(combo, data, MIN_SUPPORT)
    );

    return this.apriori(
      initialCombos,
      data,
      this.getUniqueItems(initialCombos)
    );
  }

  getUniqueItems(itemCombos) {
    return Array.from(
      itemCombos.reduce((items, itemCombo) => {
        itemCombo.forEach((item) => items.add(item));
        return items;
      }, new Set())
    );
  }

  /**
   * Assumes itemCombos already fulfills MIN_CONFIDENCE and MIN_SUPPORT
   * @param itemCombos: [[item1, ...]...], each nested array must be the same size
   */
  apriori(
    itemCombos,
    data,
    uniqueItems,
    previousCombos = [],
    min_support = MIN_SUPPORT
  ) {
    let potentialRelations = [];
    itemCombos.forEach((itemCombo1) => {
      uniqueItems.forEach((item) => {
        let newCombo = Array.from(new Set([...itemCombo1, item]));
        if (newCombo.length > itemCombo1.length)
          potentialRelations.push(newCombo);
      });
    });

    potentialRelations = potentialRelations.reduce(
      (nonDuplicates, currentItem) =>
        !nonDuplicates.find((itemCombo) =>
          itemCombo.every((item) => !!currentItem.find((c) => c === item))
        )
          ? [...nonDuplicates, currentItem]
          : nonDuplicates,
      []
    );

    let filtered = potentialRelations.filter((itemCombo) =>
      this.clearsSupport(itemCombo, data, min_support)
    );
    if (filtered.length > 1) {
      if (filtered.length > 50) {
        return this.apriori(
          itemCombos,
          data,
          uniqueItems,
          previousCombos,
          min_support + 0.02
        );
      }
      previousCombos.push(filtered);
      return this.apriori(
        filtered,
        data,
        this.getUniqueItems(filtered),
        previousCombos,
        min_support
      );
    } else if (filtered.length === 1) {
      previousCombos.push(filtered);
      return previousCombos;
    } else {
      return previousCombos;
    }
  }

  clearsSupport(itemCombo, data, min_support) {
    let support = this.calculateSupport(itemCombo, data);
    return support >= min_support;
  }

  calculateConfidence(x, y, data) {
    let xCount = 0,
      xyCount = 0;
    data.forEach((datum) => {
      let amenities = datum.amenities;
      if (this.findNumberOfMatches(x, amenities) === x.length) {
        xCount++;
        if (
          y.every(
            (yAmenity) => !!amenities.find((amenity) => amenity === yAmenity)
          )
        ) {
          xyCount++;
        }
      }
    });

    return xyCount / xCount;
  }

  calculateSupport(itemCombo, data) {
    let support = 0;
    data.forEach((datum) => {
      if (
        itemCombo.every(
          (comboAmenity) =>
            !!datum.amenities.find((amenity) => amenity === comboAmenity)
        )
      ) {
        support++;
      }
    });
    support /= data.length;
    return support;
  }

  findNumberOfMatches(itemCombo, itemCombo2) {
    let matches = 0;
    itemCombo.forEach((item) => {
      if (itemCombo2.find((item2) => item === item2)) {
        matches++;
      }
    });
    return matches;
  }

  /**
   * returns itemCombo-itemCombo2
   */
  findDifferences(itemCombo, itemCombo2) {
    if (itemCombo === null) {
      return itemCombo2;
    } else if (itemCombo2 === null) {
      return itemCombo;
    }
    return itemCombo.reduce((differences, item) => {
      if (!itemCombo2.find((i) => i === item)) {
        differences.push(item);
      }
      return differences;
    }, []);
  }
}

class TravellerRecommendations extends Recommendations {
  convertVisitsToData(visitors) {
    let data = [];
    Object.keys(visitors).forEach((visitorKey) => {
      data.push({ amenities: Object.keys(visitors[visitorKey]) });
    });
    return data;
  }

  getTravellerRecommendations(rawFirebaseData, userVisitedPlaces) {
    let data = this.convertVisitsToData(rawFirebaseData);
    let allCombos = this.findRelations(data);

    let highestConfidence = { suggestion: [], value: -1 }; // Most likely to like
    let highestSupport = { suggestion: [], value: -1 }; // Most populous
    let highestSupportConfidence = { suggestion: [], value: -1 };
    allCombos.forEach((sizedCombos) => {
      sizedCombos.forEach((combo) => {
        let differences = this.findDifferences(combo, userVisitedPlaces);
        if (differences.length !== 0) {
          let support = this.calculateSupport(combo, data);
          let confidence = this.calculateConfidence(combo, differences, data);

          if (support * confidence > highestSupportConfidence.value) {
            let currentSupportConfidence = support * confidence;
            highestSupportConfidence = {
              suggestion: differences,
              value: currentSupportConfidence,
            };
          } else if (support > highestSupport.value) {
            highestSupport = { suggestion: differences, value: support };
          } else if (confidence > highestConfidence.value) {
            highestConfidence = { suggestion: differences, value: confidence };
          }
        }
      });
    });

    if (
      this.findDifferences(
        highestConfidence.suggestion,
        highestSupportConfidence.suggestion
      ).length === 0 ||
      this.findDifferences(
        highestSupport.suggestion,
        highestConfidence.suggestion
      ).length === 0 ||
      highestConfidence.suggestion.length === 0
    ) {
      highestConfidence = null;
    }
    if (
      this.findDifferences(
        highestSupportConfidence.suggestion,
        highestSupport.suggestion
      ).length === 0 ||
      highestSupport.suggestion.length === 0
    ) {
      highestSupport = null;
    }

    return {
      highestConfidence: highestConfidence,
      highestSupport: highestSupport,
      highestSupportConfidence: highestSupportConfidence,
    };
  }
}

class OwnerRecommendations extends Recommendations {
  /**
   * returns form [{amenities: [item1, ...]}]
   */
  convertSitesToData(sites) {
    let data = [];
    Object.keys(sites).forEach((siteKey) => {
      for (let i = 0; i < sites[siteKey].numberOfVisits; i++) {
        let amenities = sites[siteKey].amenities.split(",");
        if (amenities[0] !== "") {
          data.push({
            amenities: amenities,
          });
        }
      }
    });
    return data;
  }

  /**
   *
   * @param {*} rawFirebaseData
   * @param {*} ownerSite Looks like [1,2,3,4,...]
   */
  getOwnerRecommendations(rawFirebaseData, ownerSite) {
    let data = this.convertSitesToData(rawFirebaseData);
    let allCombos = this.findRelations(data);
    let leastNewAmenities, bestSupportConfidence;
    let lowestMatch = 9999,
      highestMatchSupportConfidence = -1;
    let currentSupportConfidence = -1;
    allCombos.forEach((sizedCombos) => {
      sizedCombos.forEach((combo) => {
        let differences = this.findDifferences(combo, ownerSite);
        if (differences.length !== 0) {
          let support = this.calculateSupport(combo, data);
          let confidence = this.calculateConfidence(combo, differences, data);
          if (
            (differences.length < lowestMatch && differences.length !== 0) ||
            (differences.length === lowestMatch &&
              highestMatchSupportConfidence < support * confidence)
          ) {
            lowestMatch = differences.length;
            leastNewAmenities = combo;
            highestMatchSupportConfidence = support * confidence;
          } else if (support * confidence > currentSupportConfidence) {
            currentSupportConfidence = support * confidence;
            bestSupportConfidence = { x: combo, y: differences };
          }
        }
      });
    });
    return [
      {
        amenitiesToAdd: this.findDifferences(
          leastNewAmenities,
          ownerSite
        ).join(),
        newVisits: 0,
      },
      { amenitiesToAdd: bestSupportConfidence.y.join(), newVisits: 0 },
    ];
  }
}

module.exports.OwnerRecommendations = OwnerRecommendations;
module.exports.TravellerRecommendations = TravellerRecommendations;
