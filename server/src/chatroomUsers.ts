import express, { query } from "express";
import { IChatRoom, IPinnedItem, error } from "./types";
import db from "./firebase";
import { IBackgroundState } from "./types";

const collection = db.collection("chatroomUsers");

const chatroomUserRouter = express.Router();

//create new chatroom user
chatroomUserRouter.post("/user", async (req, res) => {
    const { userId, screenName, avatar } = req.body as { userId: string, screenName: string, avatar: string };

    const doc = await collection.doc(userId).get();

    if (doc.exists) {
        return error(res, "user already exists");
    }

    const newDoc = await collection
        .doc(userId)
        .set({ screenName, avatar });

    res.status(200).send(newDoc);

})

//get chatroom user
chatroomUserRouter.get("/get/:userId", async (req, res) => {
    const { userId } = req.params as { userId: string};

    const doc = await collection.doc(userId).get();

    if(!doc.exists){
        return res.status(200).send("");
    }

    res.status(200).send(doc.data());
})

//update user screenName
chatroomUserRouter.patch("/screen-name/:userId", async (req, res) => {
    const { userId } = req.params as { userId: string };
    const { screenName } = req.body as { screenName: string };

    const docRef = await collection.doc(userId);
    const doc = await docRef.get();

    if(!doc.exists){
        return error(res, "user does not exist");
    }

    docRef.update({ screenName });

    res.status(200).end();
})

//update user avatar
chatroomUserRouter.patch("/avatar/:userId", async (req, res) => {
    const { userId } = req.params as { userId: string };
    const { avatar } = req.body as { avatar: string };

    const docRef = await collection.doc(userId);
    const doc = await docRef.get();

    if(!doc.exists){
        return error(res, "user does not exist");
    }

    docRef.update({ avatar });

    res.status(200).end();
})

//update user email
chatroomUserRouter.patch("/email/:userId", async (req, res) => {
  const { userId } = req.params as { userId: string };
  const { email } = req.body as { email: string };

  const docRef = await collection.doc(userId);
  const doc = await docRef.get();

  if(!doc.exists){
      return error(res, "user does not exist");
  }

  docRef.update({ email });

  res.status(200).end();
})

chatroomUserRouter.get("/user-rooms/:userId", async (req, res) => {
    const { userId } = req.params as { userId: string };
    let promises: any = [];
    const chatroomsRef = db.collection("chatrooms");
    // switching to async / await since it's easier to read
    const snapshot = await chatroomsRef
      .where("lockedOwnerAddress", "==", userId)
      .get();
    const userRoomsDocs = snapshot.docs.map((doc) => doc.data() as IChatRoom);
    const pinnedBackgroundPromises = userRoomsDocs.map((room) => {
      // room.name is uid
      return db
        .collection("chatrooms")
        .doc(room.name)
        .collection("pinnedItems")
        .doc("background")
        .get();
    });
    const pinnedBackgroundsSnapshots = await Promise.all(
      pinnedBackgroundPromises
    );
    const pinnedBackgroundsDocs = pinnedBackgroundsSnapshots.map(
      (doc) => doc.data() as IBackgroundState
    );
    // now combine pinnedBackgrounds with rooms
    const responseVal = userRoomsDocs.map((room, index) => {
      return {
        roomData: room,
        background: pinnedBackgroundsDocs[index],
      };
    });
    res.status(200).send(responseVal);
  });


export default chatroomUserRouter;