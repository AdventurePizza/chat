import express, { Request, Response } from "express";
import { IChatRoom, IPinnedItem, error } from "./types";
import db from "./firebase";
import { twitterClient } from "./twitter";
import * as ethers from "ethers";
import erc20abi from "./erc20abi.json";
const collection = db.collection("chatrooms");

const roomRouter = express.Router();

// get room
roomRouter.get("/:roomId", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  if (process.env.NODE_ENV !== "production") {
    return res.status(200).send({
      name: "default",
    });
  }
  const address = req.user ? req.user.payload.publicAddress.toLowerCase() : "";

  const doc = await collection.doc(roomId).get();
  if (!doc.exists) {
    return error(res, "room does not exist");
  }
  const contractAddress = await doc.get("contractAddress");
  let visible = true;
  //If room has contract address set visibility to false until finds a permission condition.
  if(contractAddress){
    visible = false;

    let provider: ethers.providers.JsonRpcProvider;
    let contractRequiredToken: ethers.Contract;

    if (!ethers.utils.isAddress(address)) {
      return error(res, "Invalid user wallet address: " + address);
    } 
    // matic mainnet
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mainnet.maticvigil.com/v1/3cd8c7560296ba08d4c7a0f0039927e09b385123"
    );
    contractRequiredToken = new ethers.Contract(contractAddress, erc20abi, provider);

    const balance = Math.floor(await contractRequiredToken.balanceOf(address));
    if(balance !== 0){
      visible = true;
    }
  }
  if(visible){
    res.status(200).send(doc.data());
  }
  else{
    return error(res, "To view this room visitors should have token with contract address: " + contractAddress + " and logged in via metamask");
  }
});

// create room
roomRouter.post("/:roomId", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  const { isLocked } = req.body as { isLocked: boolean };
  const { contractAddress } = req.body as { contractAddress: string };
  const address = req.user ? req.user.payload.publicAddress.toLowerCase() : "";

  if (isLocked && !address) {
    return error(res, "user not authenticated to lock room");
  }

  const doc = await collection.doc(roomId).get();

  if (doc.exists) {
    return error(res, "room already exists");
  }

  await collection
    .doc(roomId)
    .set({ name: roomId, isLocked, lockedOwnerAddress: address ?? undefined , contractAddress: contractAddress ?? undefined});


  twitterClient.post(
    "statuses/update",
    {
      status: `New room created, ${roomId}, https://trychats.com/#/room/${roomId}`,
    },
    function (error, tweet) {
      if (error) console.log("error sending tweet: ", error);
    }
  );

  res.status(200).end();
});

// pin item
roomRouter.post("/:roomId/pin", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  const { item } = req.body as { item: IPinnedItem };

  const isVerifiedOwner = await verifyLockedOwner(req, res, roomId);

  if (!isVerifiedOwner) return;

  const docRef = await collection.doc(roomId);
  const doc = await docRef.get();

  if (doc.exists) {
    if (item.type === "background") {
      await docRef.collection("pinnedItems").doc("background").set(item);
    } else if (item.type === "NFT") {
      await docRef.collection("pinnedItems").doc(item.order.id).set(item);
    } else {
      await docRef
        .collection("pinnedItems")
        .doc(item.key! || item.id)
        .set(item);
    }

    res.status(200).end();
  } else {
    return error(res, "room does not exist");
  }
});

// delete pinned item
roomRouter.delete("/:roomId/pin/:itemId", async (req, res) => {
  const { roomId, itemId } = req.params as { roomId: string; itemId: string };

  const isVerifiedOwner = await verifyLockedOwner(req, res, roomId);

  if (!isVerifiedOwner) return;

  await collection.doc(roomId).collection("pinnedItems").doc(itemId).delete();

  res.status(200).end();
});

// get all pinned items
roomRouter.get("/:roomId/pin", async (req, res) => {
  const { roomId } = req.params as { roomId: string };

  const snapshot = await collection.doc(roomId).collection("pinnedItems").get();
  const docs = snapshot.docs.map((doc) => doc.data() as IPinnedItem);

  res.status(200).send(docs);
});

// get pinned background
roomRouter.get("/:roomId/pinned-background", async (req, res) => {
  const { roomId } = req.params as { roomId: string };

  const snapshot = await collection.doc(roomId).collection("pinnedItems").get();
  const docs = snapshot.docs.map((doc) => doc.data() as IPinnedItem);

  const background = {
    data: ""
  }

  docs.forEach(item => {
    if(item.type === "background"){
      if(item.subType === "image"){
        background.data = item.name
      } else if (item.subType === "map"){
        background.data = item.mapData
      }
    }
  })

  res.status(200).send(background);
})

// get all rooms
/* roomRouter.get("/", async (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    return res.status(200).send([
      {
        name: "test",
      },
    ]);
  }

  const snapshot = await collection.get();
  const docs = snapshot.docs.map((doc) => doc.data() as IChatRoom);

  res.status(200).send(docs);
}); */

// move pinned item
roomRouter.patch("/:roomId/pin/:itemId", async (req, res) => {
  const { roomId, itemId } = req.params as { roomId: string; itemId: string };
  const { item } = req.body as { item: IPinnedItem };

  const isVerifiedOwner = await verifyLockedOwner(req, res, roomId);

  if (!isVerifiedOwner) return;

  const docRef = await collection
    .doc(roomId)
    .collection("pinnedItems")
    .doc(item.key! || item.order.id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return error(res, "room does not exist");
  }

  await docRef.update({ top: item.top, left: item.left });

  res.status(200).end();
});

// get chat
roomRouter.get("/:roomId/getChat", async (req, res) => {
  const { roomId } = req.params as { roomId: string };

  const snapshot = await collection.doc(roomId).collection("chat").get();
  const docs = snapshot.docs.map((doc) => doc.data() as IPinnedItem);

  res.status(200).send(docs);
});

// add a message to chat
roomRouter.post("/:roomId/addtoChat", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  const { message } = req.body as { message: string };
  const { avatar } = req.body as { avatar: string };
  const { name } = req.body as { name: string };
  const { timestamp } = req.body as { timestamp: string };

  const docRef = await collection.doc(roomId);
  const doc = await docRef.get();

  if (doc.exists) {
    await docRef.collection("chat").doc(timestamp).set({ message: message, avatar: avatar, name: name, timestamp: timestamp });
    res.status(200).end();
  } else {
    return error(res, "room does not exist");
  }
});

// get playlist
roomRouter.get("/:roomId/getPlaylist", async (req, res) => {
  const { roomId } = req.params as { roomId: string };

  const snapshot = await collection.doc(roomId).collection("playlist").get();
  const docs = snapshot.docs.map((doc) => doc.data() as IPinnedItem);

  res.status(200).send(docs);
});

// add a track to playlist
roomRouter.post("/:roomId/addtoPlaylist", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  const { track } = req.body as { track: string };
  const { name } = req.body as { name: string };
  const { timestamp } = req.body as { timestamp: string };

  const isVerifiedOwner = await verifyLockedOwner(req, res, roomId);

  if (!isVerifiedOwner) return;

  const docRef = await collection.doc(roomId);
  const doc = await docRef.get();

  if (doc.exists) {
    await docRef.collection("playlist").doc(timestamp).set({ url: track, name: name, timestamp: timestamp });
    res.status(200).end();
  } else {
    return error(res, "room does not exist");
  }
});

//delete a track from playlist
roomRouter.delete("/:roomId/playlist/:timestamp", async (req, res) => {
  const { roomId, timestamp } = req.params as { roomId: string; timestamp: string };
  const isVerifiedOwner = await verifyLockedOwner(req, res, roomId);

  if (!isVerifiedOwner) return;

  await collection.doc(roomId).collection("playlist").doc(timestamp).delete();

  res.status(200).end();
});


const lockedRooms: { [roomId: string]: { ownerAddress: string } } = {};

const getLockedOwnerAddress = async (
  roomId: string
): Promise<string | null> => {
  if (lockedRooms[roomId]) {
    return lockedRooms[roomId].ownerAddress;
  }

  const doc = await collection.doc(roomId).get();

  if (!doc.exists) {
    return null;
  }

  const docData = doc.data() as IChatRoom;

  if (docData.lockedOwnerAddress && docData.isLocked) {
    lockedRooms[roomId] = { ownerAddress: docData.lockedOwnerAddress };
    return docData.lockedOwnerAddress;
  }

  return null;
};

export default roomRouter;

const verifyLockedOwner = async (
  req: Request,
  res: Response,
  roomId: string
): Promise<boolean> => {
  const address = req.user ? req.user.payload.publicAddress.toLowerCase() : "";

  const lockedOwnerAddress = await getLockedOwnerAddress(roomId);

  if (lockedOwnerAddress && lockedOwnerAddress !== address.toLowerCase()) {
    error(res, "unauthorized user for locked room");
    return false;
  }

  return true;
};
