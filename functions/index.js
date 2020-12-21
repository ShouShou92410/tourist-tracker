const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

admin.initializeApp();

const fpmConstants = {
  MIN_SUPPORT: 0.5,
  MIN_CONF: 0.5,
};

class Pointer {
  constructor(index, finalIndex) {
    this._index = index;
    this._finalIndex = finalIndex;
    this._nextPointer = null;
    this._prevPointer = null;
  }
  get index() {
    return this._index;
  }
  set index(newIndex) {
    this._index = newIndex;
  }
  get finalIndex() {
    return this._finalIndex;
  }
  set finalIndex(newFinalIndex) {
    this._finalIndex = newFinalIndex;
  }
  get nextPointer() {
    return this._nextPointer;
  }
  set nextPointer(newNextPointer) {
    this._nextPointer = newNextPointer;
  }
  get prevPointer() {
    return this._prevPointer;
  }
  set prevPointer(newPrevPointer) {
    this._prevPointer = newPrevPointer;
  }
}

function getComboCount(input, combo) {
  let count = 0;
  //console.log("inside getComboCount function");
  //console.log(input);
  //console.log(combo);
  input.forEach((row) => {
    //console.log(row);
    let containsAll = true;
    comboElements = combo.split(",");
    //console.log(comboElements);
    //console.log(combo);
    //console.log(row);
    for (let x = 0; x < comboElements.length; x++) {
      //console.log(comboElements[x]);
      //console.log(row.includes(comboElements[x]));
      if (!row.includes(comboElements[x])) {
        containsAll = false;
      }
    }
    if (containsAll) {
      count++;
    }
  });
  return count;
}

function printPointerPositions(pointers) {
  let x = 0;
  let pointer = pointers[x];
  while (pointer != null) {
    console.log(
      `pointer${x}: index = ${pointer.index}    finalIndex = ${pointer.finalIndex}`
    );
    x++;
    pointer = pointer.nextPointer;
  }
  console.log("done print");
}

function checkSupport([key, value], support, filteredOut) {
  if (value >= support) {
    return true;
  }
  filteredOut.add(key);
  //console.log(key);
  //console.log(value);
  return false;
}

function addCombo(input, chosen, pointers) {
  let combo = "";
  let pointer = pointers[0];
  //console.log("inside adding combo function");
  //console.log(input);
  //console.log(chosen);
  //console.log(pointers);

  do {
    //console.log(`combo do while loop: pointer.index: ${pointer.index}`);
    combo = combo + input[pointer.index];
    if (pointer.nextPointer != null) {
      combo = combo + ",";
    }
    pointer = pointer.nextPointer;
    //console.log(`before loop check combo: ${combo}`);
  } while (pointer != null);
  chosen.add(combo);
}

function checkPositions(pointers) {
  let allInFinalPosition = true;
  let pointer = pointers[0];
  while (pointer != null) {
    if (pointer.index != pointer.finalIndex) {
      allInFinalPosition = false;
      break;
    }
    pointer = pointer.nextPointer;
  }
  return allInFinalPosition;
}
function adjustPointerPositions(pointers) {
  let x = 0;
  let pointer = pointers[x];
  while (pointer.nextPointer != null) {
    pointer = pointer.nextPointer;
    x++;
  }
  //console.log("pre adjustPointerPositions ");
  //printPointerPositions(pointers);
  while (pointer != null) {
    if (pointer.index != pointer.finalIndex) {
      pointer.index = pointer.index + 1;
      //console.log(`adjusting pointer${x} from index ${pointer.index - 1} to index ${pointer.index}`);
      let setNextPointerPos = pointer.index + 1;
      while (pointer.nextPointer != null) {
        pointer = pointer.nextPointer;
        x++;
        //console.log(`$setting pointer${x}.index to setNextPointerPos(${setNextPointerPos})`);
        pointer.index = setNextPointerPos;
        setNextPointerPos = setNextPointerPos + 1;
      }
      //console.log("post adjustPointerPositions");
      //printPointerPositions(pointers);
      break;
    } else {
      pointer = pointer.prevPointer;
    }
  }
}

function generateCombinations(input, n) {
  let chosen = new Set();
  const pointers = [];
  for (let x = 0; x < n; x++) {
    pointers.push(new Pointer(x, input.length - (n - x)));
    if (x > 0) {
      pointers[x - 1].nextPointer = pointers[x];
      pointers[x].prevPointer = pointers[x - 1];
    }
  }
  //console.log("generatedPointers");
  //console.log(pointers);
  //console.log("initial chosen");
  //console.log(chosen);
  do {
    //console.log("adding combo");
    addCombo(input, chosen, pointers);
    //console.log("combo added");
    //console.log(chosen);
    adjustPointerPositions(pointers);
  } while (!checkPositions(pointers));
  addCombo(input, chosen, pointers);
  //console.log(chosen);

  return chosen;
}

function prune(combo, filteredOut) {
  //console.log("combo");
  //console.log(combo);
  let subSetList = new Set();
  const comboArray = combo.split(",");
  for (let x = 1; x < comboArray.length; x++) {
    let sizeXSubSet = generateCombinations(comboArray, x);
    sizeXSubSet.forEach((y) => subSetList.add(y));
    //console.log("subsetList");
    //console.log(subSetList);
  }
  let containsInfreqPair = false;
  subSetList.forEach((subSet) => {
    //console.log("subset");
    //console.log(subSet);
    //console.log(`filteredOut.has(subSet): ${filteredOut.has(subSet)}`);
    if (filteredOut.has(subSet)) {
      containsInfreqPair = true;
    }
  });
  //console.log(containsInfreqPair);
  return containsInfreqPair;
}

function nSizeSetApriori(
  input,
  uniqueValues,
  support,
  filteredOut,
  previousSet,
  setSize
) {
  //console.log(setSize);
  //console.log(uniqueValues);
  if (uniqueValues.length >= setSize) {
    let numOfCombos = previousSet.length;
    let combos = generateCombinations(uniqueValues, setSize);
    //console.log("pre pruning");
    //console.log(filteredOut);
    //console.log(combos);
    if (setSize > 2) {
      combos.forEach((combo) => {
        if (prune(combo, filteredOut)) {
          combos.delete(combo);
        }
      });
    }
    //console.log("post pruning");
    //console.log(filteredOut);
    //console.log(combos);
    const counts = {};
    combos.forEach((combo) => (counts[combo] = getComboCount(input, combo)));
    //console.log(counts);
    const resultArray = Object.entries(counts).filter(([key, value]) =>
      checkSupport([key, value], support, filteredOut)
    );
    const result = Object.fromEntries(resultArray);
    //console.log(Object.keys(result));
    //console.log(Object.keys(result).length);
    if (Object.keys(result).length > 0) {
      //console.log("testing");
      const remainingUniqueValues = {};
      Object.keys(result).forEach((x) => {
        const row = x.split(",");
        row.forEach((y) => {
          remainingUniqueValues[y] = (remainingUniqueValues[y] || 0) + 1;
        });
      });
      //console.log(Object.keys(remainingUniqueValues));
      Object.keys(result).forEach((subSet) => {
        previousSet.add(subSet);
      });
      previousSet = nSizeSetApriori(
        input,
        Object.keys(remainingUniqueValues),
        support,
        filteredOut,
        previousSet,
        setSize + 1
      );
    }
    //console.log(Object.keys(result));
    //console.log(filteredOut);
  } else {
    return previousSet;
  }
}

function initialSetApriori(input, support, filteredOut) {
  //console.log(input.length);
  //console.log(support);
  let uniqueVals;
  const counts = {};
  input.forEach((x) => {
    x.forEach((y) => {
      counts[y] = (counts[y] || 0) + 1;
    });
  });
  // Filter out those below min support
  const resultArray = Object.entries(counts).filter(([key, value]) =>
    checkSupport([key, value], support, filteredOut)
  );
  const result = Object.fromEntries(resultArray);
  //console.log(input);
  //console.log(Object.keys(result));
  //console.log(filteredOut);
  return Object.keys(result);
}

function FPM(input) {
  let supportThreshold = Math.ceil(input.length * fpmConstants.MIN_SUPPORT);
  let filteredOut = new Set();
  const uniqueValues = initialSetApriori(input, supportThreshold, filteredOut);
  let solutionCombos = new Set();
  nSizeSetApriori(
    input,
    uniqueValues,
    supportThreshold,
    filteredOut,
    solutionCombos,
    2
  );
  //console.log(solutionCombos);
  //console.log(filteredOut);
  const rules = generateRules(solutionCombos, input);
}

function generateRules(combos, input) {
  const rules = new Set();
  combos.forEach((combo) => {
    const comboArray = combo.split(",");
    let subSetList = new Set();
    for (let x = 1; x < comboArray.length; x++) {
      let sizeXSubSet = generateCombinations(comboArray, x);
      sizeXSubSet.forEach((x) => subSetList.add(x));
    }
    let comboSupport = 0;
    input.forEach((row) => {
      let rowContainsCombo = true;
      for (let x = 0; x < comboArray.length; x++) {
        if (!row.includes(comboArray[x])) {
          rowContainsCombo = false;
        }
      }
      if (rowContainsCombo) {
        comboSupport++;
      }
    });
    subSetList.forEach((subSet) => {
      const subSetArray = subSet.split(",");
      let subSetSupport = 0;
      input.forEach((row) => {
        let rowContainsSubSet = true;
        for (let x = 0; x < subSetArray; x++) {
          if (!row.includes(subSetArray[x])) {
            rowContainsSubSet = false;
          }
        }
        if (rowContainsSubSet) {
          subSetSupport++;
        }
      });
      let subSetConf;
      if (subSetSupport > 0) {
        subSetConf = comboSupport / subSetSupport >= fpmConstants.MIN_CONF;
      } else {
        //console.log(subSet);
      }
      if (subSetConf) {
        let comboMinusSubsetString = "";
        comboArray.forEach((element) => {
          if (!subSet.includes(element)) {
            comboMinusSubsetString += element + ",";
          }
        });
        comboMinusSubsetString = comboMinusSubsetString.slice(
          0,
          comboMinusSubsetString.length - 1
        );
        rules.add(`(${subSet})->(${comboMinusSubsetString})`);
      }
    });
  });
  console.log(rules);
  return rules;
}

function AuthorizationMiddleware(req, res, next) {
  const token = Buffer.from(req.headers.authorization, "base64").toString();

  admin
    .auth()
    .verifyIdToken(token)
    .then((user) => {
      res.locals.currentUser = user;

      next();

      return;
    })
    .catch((error) => {
      console.error(error);
    });
}

// Add 'recommendation' after '/' when testing the express server hosted locally
app.get("/recommendation", AuthorizationMiddleware, async (req, res) => {
  // UNDO
  const currentUser = res.locals.currentUser;

  let dbUser = await admin
    .database()
    .ref(`/users/${currentUser.uid}`) // UNDO
    .once("value");
  dbUser = dbUser.val();

  const result = {
    ...dbUser,
  };
  //console.log(`1: ${currentUser.uid}`);
  let visitedSites = await admin.database().ref(`/visitedSites`).once("value");
  if (visitedSites != null) {
    //console.log(visitedSites.val());
    visitedSites = Object.entries(visitedSites.val()).filter(
      ([key, value]) => key != currentUser.uid
    );
    //console.log(visitedSites);
    visitedSites = Object.values(Object.fromEntries(visitedSites)).map((x) =>
      Object.entries(x).map((y) => y[0])
    );
    //console.log(visitedSites);
    const initInput = [
      ["1", "2", "4", "5", "6"],
      ["1", "3", "4", "5", "7"],
      ["2", "3", "5", "7"],
      ["1", "5", "6", "7"],
      ["1", "3", "4", "7"],
    ];
    const initInput2 = [
      [1, 2, 3],
      [2, 3],
    ];
    const initInput3 = [
      ["Alex", "Ken", "David"],
      ["Bob", "Ken", "Mike"],
      ["Alex", "Bob", "Ken", "Mike"],
      ["Bob", "Mike"],
    ];
    FPM(initInput3);
  } else {
    visitedSites = [];
  }

  // TODO: Replace with user type enumerations
  switch (dbUser.type) {
    case 1:
      result.message = "Generate recommendation for traveller";
      break;
    case 2:
      result.message = "Generate recommendation for site owner";
      break;
  }
  console.log("Hello");
  res.send(result);
});

// Used to test the express server hosted locally
app.listen(8000, () => {
  console.log("Server started at http://localhost:8000/");
});

exports.recommendation = functions.https.onRequest(app);
