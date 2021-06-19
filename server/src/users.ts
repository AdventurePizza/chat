import express from "express";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";
var expressjwt = require("express-jwt");

const usersRouter = express.Router();

usersRouter.get("/:address", async (req, res) => {
  const { address } = req.params;

  if (!address) return res.status(400).send("no address given");

  const result = await (
    await firebase.collection("users").doc(address.toLowerCase()).get()
  ).data();

  return res.status(200).send({
    ...result,
    habits: undefined,
    txHash: undefined,
    latestTxAmount: undefined,
  });
});

usersRouter.post(
  "/auth",
  expressjwt({
    //@ts-ignore
    secret: Buffer.from(process.env.JWT_SECRET, "base64"),
    algorithms: ["HS256"],
  }),
  async (req, res) => {
    const address = req.user.payload.id;

    if (!address) return res.status(400).send("no address given");

    const result = await (
      await firebase.collection("users").doc(address.toLowerCase()).get()
    ).data();

    return res.status(200).send({
      ...result,
    });
  }
);

usersRouter.post("/", async (req, res) => {
  let { publicAddress } = req.body as { publicAddress?: string };

  if (!publicAddress) return res.status(400).send("no address given");

  publicAddress = publicAddress.toLowerCase();

  const newNonce = uuid();

  firebase
    .collection("users")
    .doc(publicAddress)
    .set({ publicAddress, nonce: newNonce })
    .then(() => res.status(200).send({ publicAddress, nonce: newNonce }))
    .catch((err) => res.status(400).send(err));
});

usersRouter.patch(
  "/",
  expressjwt({
    //@ts-ignore
    secret: Buffer.from(process.env.JWT_SECRET, "base64"),
    algorithms: ["RS256"],
  }),
  async (req, res) => {
    if (!req.body || !req.body.publicAddress) {
      return res.status(400).send({ error: "Missing public address" });
    }

    firebase
      .collection("users")
      .doc(req.body.publicAddress.toLowerCase())
      .set(req.body)
      .then(() => res.status(200).send({}))
      .catch(res.status(400).send);
  }
);

export default usersRouter;
