const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const Recommendations = require("./Recommendations/recommendations")

admin.initializeApp();

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
  const currentUser = res.locals.currentUser;

  let dbUser = await admin
    .database()
    .ref(`/users/${currentUser.uid}`) // UNDO
    .once("value");
  dbUser = dbUser.val();

  /*
  const result = {
    ...dbUser,
  };
  */

  // TODO: Replace with user type enumerations
  switch (dbUser.type) {
    case 1:
      // result.message = "Generate recommendation for traveller";

      const travellerRecs = new Recommendations.TravellerRecommendations()
      const allVisits = (await admin
      .database()
      .ref(`/visitedSites`)
      .once("value")).val();

      let userVisits = (await admin
      .database()
      .ref(`/visitedSites/${currentUser.uid}`)
      .once("value")).val();
      userVisits = Object.keys(userVisits)

      console.log(currentUser.uid)

      let recommendations = travellerRecs.getTravellerRecommendations(allVisits, userVisits)

      console.log(recommendations)
      res.send(recommendations);
      break;
    case 2:
      // result.message = "Generate recommendation for site owner";
      const siteId = req.query.siteId;
      console.log(siteId);
      
      const siteOwnerRecs = new Recommendations.OwnerRecommendations()
      const allSites = (await admin
      .database()
      .ref(`/sites`)
      .once("value")).val();

      let ownersSite = (await admin
      .database()
      .ref(`/sites/${siteId}`)
      .once("value")).val();

      const recs = siteOwnerRecs.getOwnerRecommendations(allSites, ownersSite.amenities.split(","))
      console.log(recs)
      res.send(recs)
      break;
  }
  console.log("Hello");
});

// Used to test the express server hosted locally
app.listen(8000, () => {
  console.log("Server started at http://localhost:8000/");
});

exports.recommendation = functions.https.onRequest(app);
