import express, { Request, Response } from "express";
import { IChatRoom, error, IPinnedItem } from "./types";
import db from "./firebase";
import * as ethers from "ethers";
import erc20abi from "./erc20abi.json";
import { TRYCHATS } from "./typechain/TRYCHATS";

const collection = db.collection("tokenClaims");

const tokenRouter = express.Router();

// request tokens
tokenRouter.post("/:tokenId", async (req, res) => {
  const { tokenId } = req.params as { tokenId: string };

  if (process.env.NODE_ENV !== "production") {
    return res.status(200).end();
  }

  const address = req.user ? req.user.payload.publicAddress.toLowerCase() : "";

  if (!address) {
    return error(res, "Must be logged in to claim tokens");
  }

  if (tokenId !== "trychats") {
    return error(res, "Invalid token claim: " + tokenId);
  }

  if (!ethers.utils.isAddress(address)) {
    return error(res, "Invalid address: " + address);
  }

  // check if previously claimed

  const doc = await collection.doc(address).get();
  const docData = (await doc.data()) as IClaimDoc;

  if (!doc.exists || !docData[tokenId]) {
    // transfer token
    await contractTRYCHATS.transfer(address, ethers.utils.parseEther("10000"));

    // write to database
    await collection.doc(address).set(
      {
        [tokenId]: true,
      },
      { merge: true }
    );

    return res.status(200).end();
  }

  return error(res, "Already claimed token");
});

export default tokenRouter;

interface IClaimDoc {
  [tokenId: string]: boolean;
}

let provider: ethers.providers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contractTRYCHATS: ethers.Contract;

if (process.env.NODE_ENV === "production") {
  // matic mainnet
  provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mainnet.maticvigil.com/v1/3cd8c7560296ba08d4c7a0f0039927e09b385123"
  );

  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  contractTRYCHATS = new ethers.Contract(
    "0x770dc23a0a69195d7bd2aa5b73a279b533326e03",
    erc20abi
  ).connect(wallet) as TRYCHATS;
}
