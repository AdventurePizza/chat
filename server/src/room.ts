import express, { Request, Response } from "express";
import { IChatRoom, IPinnedItem } from "./types";
import db from "./firebase";

const collection = db.collection("chatrooms");

const roomRouter = express.Router();

// get room
roomRouter.get("/:roomId", async (req, res) => {
  const { roomId } = req.params as { roomId: string };

  const doc = await collection.doc(roomId).get();

  if (!doc.exists) {
    return error(res, "room does not exist");
  }

  res.status(200).send(doc.data());
});

// create room
roomRouter.post("/:roomId", async (req, res) => {
  const { roomId } = req.params as { roomId: string };
  const { isLocked } = req.body as { isLocked: boolean };

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
    .set({ name: roomId, isLocked, lockedOwnerAddress: address ?? undefined });

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
    } else {
      await docRef.collection("pinnedItems").doc(item.key!).set(item);
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

// get all rooms
roomRouter.get("/", async (req, res) => {
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
    .doc(item.key!);
  const doc = await docRef.get();

  if (!doc.exists) {
    return error(res, "room does not exist");
  }

  await docRef.update({ top: item.top, left: item.left });

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

  if (docData.lockedOwnerAddress) {
    lockedRooms[roomId] = { ownerAddress: docData.lockedOwnerAddress };
  }

  return docData.lockedOwnerAddress ?? null;
};

export default roomRouter;

const error = (res: Response, message: string) => {
  res.statusMessage = message;
  return res.status(400).end();
};

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
