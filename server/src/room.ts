import express, { Request, Response } from "express";
import { IChatRoom, IPinnedItem, error } from "./types";
import db from "./firebase";
import { twitterClient } from "./twitter";
import * as ethers from "ethers";
import erc20abi from "./erc20abi.json";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
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

// generate room
roomRouter.post("/generate", async (req, res) => {
  
  const { collectionName } = req.body as { collectionName: string };
  const isLocked = true;
  let go = true;
  const batch = db.batch()
  let offset = 0;
  let amount = 50;
  do{
    await axios.get('https://api.opensea.io/api/v1/assets?order_by=token_id&order_direction=asc&offset=' + offset + '&limit=' + amount + '&collection=' + collectionName).then((res) => {
      for(let j = 0; j < amount; j++){

        let name = collectionName + " " + res.data.assets[j].token_id;

        collection
        .doc(name)
        .set({ name: name, isLocked, lockedOwnerAddress: "dynamic" });

        let key = uuidv4();

        collection
        .doc(name)
        .collection("pinnedItems")
        .doc(key)
        .set({key: key, left: 0.5, top: 0.5, type: "image", url: res.data.assets[j].image_url});

        if(res.data.assets[j].animation_url){
          let timestamp = new Date().getTime().toString();
          let trackName = name;
          if(res.data.assets[j].name){
            trackName = res.data.assets[j].name;
          }

          collection
          .doc(name)
          .collection("playlist")
          .doc( timestamp )
          .set({ url: res.data.assets[j].animation_url, name: trackName, timestamp: timestamp });
        }

      }
      offset += amount;
      }).catch((error) => {
        go = false;
        //console.error("The Promise is rejected!", error);
      });
      
      if(!go){
        amount = (amount/2) | 0;
        go = true;
      }
    }while(amount > 0)

  batch.commit();
  res.status(200).end();
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
    }else if (item.type === "race") {
      await docRef.collection("pinnedItems").doc("race").set(item);
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
roomRouter.get("/", async (req, res) => {
  /*if (process.env.NODE_ENV !== "production") {
    return res.status(200).send([
      {
        name: "test",
      },
    ]);
  }*/

  const snapshot = await collection.get();
  const docs = snapshot.docs.map((doc) => doc.data() as IChatRoom);

  res.status(200).send(docs);
});

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

  if(docData.lockedOwnerAddress === "dynamic"){
    return docData.lockedOwnerAddress;
  }

  else if (docData.lockedOwnerAddress && docData.isLocked) {
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

  let lockedOwnerAddress = await getLockedOwnerAddress(roomId);

  if(lockedOwnerAddress === "dynamic"){
    const words = roomId.split(' ');
    const tokenId = words[words.length-1];
    const collectionName = roomId.replace(' ' + tokenId, '');

    if(!address){
      error(res, "unauthorized user for locked room");
      return false;
    }
    await axios.get('https://api.opensea.io/api/v1/assets?owner=' + address + '&order_direction=desc&offset=0&limit=50').then((result) => {
      let permission = false;
      for(let i = 0; i < result.data.assets.length; i++){
        if(tokenId === result.data.assets[i].token_id && collectionName === result.data.assets[i].collection.slug){
          permission = true;
        }
      }
      if(permission){
        return true;
      } 
      else{
        error(res, "unauthorized user for locked room");
        return false;
      }
    });
    
  }

  else if (lockedOwnerAddress && lockedOwnerAddress !== address.toLowerCase()) {
    error(res, "unauthorized user for locked room");
    return false;
  }

  return true;
};
