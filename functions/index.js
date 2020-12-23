const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const Recommendations = require("./Recommendations/recommendations");

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
// Make sure to remove it during exployment.
app.get("/", AuthorizationMiddleware, async (req, res) => {
  const currentUser = res.locals.currentUser;

  let dbUser = await admin
    .database()
    .ref(`/users/${currentUser.uid}`)
    .once("value");
  dbUser = dbUser.val();

  // Traveller type
  if (dbUser.type === 1) {
    const travellerRecs = new Recommendations.TravellerRecommendations();

    let userVisits = (
      await admin
        .database()
        .ref(`/visitedSites/${currentUser.uid}`)
        .once("value")
    ).val();
    userVisits = Object.keys(userVisits);

    let allVisits = (
      await admin.database().ref(`/visitedSites`).once("value")
    ).val();
    delete allVisits[currentUser.uid];

    console.log(allVisits)

    let recommendations = travellerRecs.getTravellerRecommendations(
      allVisits,
      userVisits
    );

    res.send(recommendations);
  }
  // Site Owner type
  else if (dbUser.type === 2) {
    const siteId = req.query.siteId;

    const siteOwnerRecs = new Recommendations.OwnerRecommendations();
    const allSites = (await admin.database().ref(`/sites`).once("value")).val();

    let ownersSite = (
      await admin.database().ref(`/sites/${siteId}`).once("value")
    ).val();

    const recs = siteOwnerRecs.getOwnerRecommendations(
      allSites,
      ownersSite.amenities.split(",")
    );
    res.send(recs);
  }
});

// Used to test the express server hosted locally
//  app.listen(8000, () => {
//    console.log("Server started at http://localhost:8000/");
//  });

exports.recommendation = functions.https.onRequest(app);
