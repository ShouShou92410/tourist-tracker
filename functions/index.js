const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

admin.initializeApp();

function AuthorizationMiddleware(req, res, next) {
  const token = Buffer.from(req.headers.authorization, "base64").toString();

  admin
    .auth()
    .verifyIdToken(token)
    .then((user) => {
      res.locals.currentUser = user;

      next();
    })
    .catch((error) => {
      console.error(error);
    });
}

app.get("/", AuthorizationMiddleware, async (req, res) => {
  const currentUser = res.locals.currentUser;

  const dbUser = await admin
    .database()
    .ref(`/users/${currentUser.uid}`)
    .once("value");

  res.send(dbUser);
});

// app.listen(8000, () => {
//   console.log("Server started at http://localhost:8000/");
// });

exports.express = functions.https.onRequest(app);
