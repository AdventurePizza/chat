import * as admin from "firebase-admin";
import path from "path";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      //@ts-ignore
      Buffer.from(process.env.FIREBASE_CONFIG_BASE64, "base64").toString(
        "ascii"
      )
    )
  ),
  databaseURL: "https://private2-e25c9.firebaseio.com",
});

const db = admin.firestore();

export default db;
