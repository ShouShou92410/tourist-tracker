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

app.get("/recommendation", AuthorizationMiddleware, (req, res) => {
  const currentUser = res.locals.currentUser;
  admin
    .database()
    .ref(`/users/${currentUser.uid}`)
    .once("value")
    .then((dbRes) => {
      const dbUser = dbRes.val();
      const result = {
        ...dbUser,
      };
      // TODO: Replace with user type enumerations
      switch (dbUser.type) {
        case 1:
          result.message = "Generate recommendation for traveller";
          break;
        case 2:
          result.message = "Generate recommendation for site owner";
          break;
      }

      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
});

// app.listen(8000, () => {
//   console.log("Server started at http://localhost:8000/");
// });

exports.express = functions.https.onRequest(app);
