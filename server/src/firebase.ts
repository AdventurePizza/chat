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
  databaseURL: "https://test-chat-5cd15.firebaseio.com",
});

const db = admin.firestore();

export default db;
