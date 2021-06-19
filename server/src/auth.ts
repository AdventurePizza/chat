import * as jwt from "jsonwebtoken";

import express from "express";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";

const sigUtil = require("eth-sig-util");

// has to be exactly same as message on front end
const msgParams = (nonce: string) => [
  {
    type: "string",
    name: "Message",
    value: "Hi, please sign in",
  },
  {
    type: "string",
    name: "One-time nonce",
    value: nonce,
  },
];

const authRouter = express.Router();

authRouter.post("/", async (req, res) => {
  let { signature, publicAddress } = req.body;

  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: "Request should have signature and publicAddress" });

  publicAddress = publicAddress.toLowerCase();

  // get user from db
  const user = await firebase.collection("users").doc(publicAddress).get();

  const userData = await user.data();

  if (!user || !userData) {
    return res.status(401).send({
      error: `User with publicAddress ${publicAddress} is not found in database`,
    });
  }

  // recover address using sig
  const recovered = sigUtil.recoverTypedSignature({
    data: msgParams(userData.nonce),
    sig: signature,
  });
  if (recovered.toLowerCase() !== publicAddress.toLowerCase()) {
    return res.status(401).send({ error: "Signature verification failed" });
  }

  // set new nonce
  const newNonce = uuid();
  user.ref.update({ nonce: newNonce });

  // create jwt
  jwt.sign(
    {
      payload: {
        id: user.id,
        publicAddress,
      },
    },
    //@ts-ignore
    Buffer.from(process.env.JWT_SECRET, "base64"),
    {
      expiresIn: "24h",
    },
    (err, accessToken) => {
      if (err) {
        console.log(err);
      }
      return res.json({ accessToken, userData });
    }
  );
});

export default authRouter;
