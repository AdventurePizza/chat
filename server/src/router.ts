import socketio, { Socket } from "socket.io";

import express from "express";
import http from "http";
import { v4 as uuidv4 } from "uuid";

const IS_DEBUG = false;

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

const clientPositions: { [clientId: string]: { x: number; y: number } } = {};
const DEFAULT_IMAGE_BACKGROUND = undefined;

const chatMessages: { [userId: string]: string[] } = {};
const clientRooms: { [userId: string]: string } = {};

// export interface IBackgroundState {
//   imageTimeout?: NodeJS.Timeout;
//   currentBackground: string | undefined;
// }
export interface IBackgroundState {
  [roomId: string]: {
    imageTimeout?: NodeJS.Timeout;
    currentBackground: string | undefined;
  };
}

export interface ITowerUnit {
  key: string;
  type: "grunt";
}

export interface ITowerBuilding {
  key: string;
  type: "basic";
  top: number;
  left: number;
}

interface ITowerDefenseStateRoom {
  isPlaying: boolean;
  units: ITowerUnit[];
  towers: ITowerBuilding[];
  towerDefenseGameInterval?: NodeJS.Timeout;
  loopCounter: number;
}

export interface ITowerDefenseState {
  [roomId: string]: ITowerDefenseStateRoom;
}

let towerDefenseState: ITowerDefenseState = {};

let backgroundState: IBackgroundState = {};

interface IMessageEvent {
  key:
    | "sound"
    | "emoji"
    | "chat"
    | "gif"
    | "tower defense"
    | "background"
    | "messages"
    | "whiteboard"
    | "isTyping"
    | "username";
  value?: string;
  [key: string]: any;
}

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: Socket) => {
      IS_DEBUG && console.log("connected user");

      createProfile(socket);

      chatMessages[socket.id] = [];

      // emit all latest chat messages
      socket.emit("event", {
        key: "messages",
        value: chatMessages,
      });

      // So you only need to change the server for having a different DEFAULT_IMAGE_BACKGROUND, client will prevent unnecessary background changes
      // Although, the client still needs to have the image in "BackgroundImages.ts"

      socket.emit("profile info", clientProfiles[socket.id]);

      //   socket.broadcast.emit("new user", clientProfiles[socket.id]);
      socket
        .to(clientRooms[socket.id])
        .emit("new user", clientProfiles[socket.id]);

      socket.on("event", (message: IMessageEvent) => {
        this.handleEvent(message, socket);
      });

      socket.on("connect room", (roomId: string) => {
        if (roomId) {
          socket.join(roomId);
          clientRooms[socket.id] = roomId;

          socket.emit("event", {
            key: "background",
            value: backgroundState[roomId]
              ? backgroundState[roomId].currentBackground
              : undefined,
          });

          const towerDefenseStateRoom = towerDefenseState[roomId];

          if (!towerDefenseStateRoom) {
            towerDefenseState[roomId] = {
              isPlaying: false,
              units: [],
              towers: [],
              loopCounter: 0,
            };
          }

          if (towerDefenseStateRoom && towerDefenseStateRoom.isPlaying) {
            socket.emit("event", { key: "tower defense", value: "start" });
            socket.emit("event", {
              key: "tower defense",
              value: "towers",
              towers: towerDefenseState.towers,
            });
          }
        }
      });

      socket.on("disconnect", () => {
        // io.emit("roommate disconnect", socket.id);
        socket
          .to(clientRooms[socket.id])
          .emit("roommate disconnect", socket.id);
        delete clientProfiles[socket.id];
        delete selectedAvatars[socket.id];
        delete chatMessages[socket.id];
      });

      socket.on("cursor move", (data) => {
        const { x, y } = data;
        clientPositions[socket.id] = { x, y };

        // socket.broadcast.emit(
        socket
          .to(clientRooms[socket.id])
          .broadcast.emit(
            "cursor move",
            socket.id,
            [x, y],
            clientProfiles[socket.id]
          );
      });
    });
  }

  handleEvent = (message: IMessageEvent, socket: Socket) => {
    const room = clientRooms[socket.id];
    switch (message.key) {
      case "sound":
        // socket.broadcast.emit("event", message);
        socket.to(room).broadcast.emit("event", message);
        break;

      case "emoji":
        // socket.broadcast.emit("event", message);
        socket.to(room).broadcast.emit("event", message);
        break;

      case "chat":
        socket.to(room).emit("event", {
          key: "chat",
          userId: socket.id,
          value: message.value,
        });

        // io.emit("event", {
        //   key: "chat",
        //   userId: socket.id,
        //   value: message.value,
        // });

        if (message.value) {
          chatMessages[socket.id].push(message.value);
        }
        break;

      case "gif":
        // io.emit("event", message);
        socket.to(room).emit("event", message);
        break;

      case "isTyping":
        // io.emit("event", { ...message, id: socket.id });
        socket.to(room).emit("event", { ...message, id: socket.id });
        break;

      case "username":
        // io.emit("event", { ...message, id: socket.id });
        socket.to(room).emit("event", { ...message, id: socket.id });
        clientProfiles[socket.id].name = message.value as string;
        break;

      case "tower defense":
        const towerDefenseStateRoom = towerDefenseState[clientRooms[socket.id]];
        if (message.value === "start" && !towerDefenseStateRoom.isPlaying) {
          startGame(room);
        }
        if (message.value === "add tower") {
          socket.to(room).emit("event", {
            key: "tower defense",
            value: "add tower",
            x: message.x,
            y: message.y,
            type: message.type,
            towerKey: uuidv4(),
          });
          //   io.emit("event", {
          //     key: "tower defense",
          //     value: "add tower",
          //     x: message.x,
          //     y: message.y,
          //     type: message.type,
          //     towerKey: uuidv4(),
          //   });

          towerDefenseStateRoom.towers.push({
            key: uuidv4(),
            type: message.type,
            top: message.y,
            left: message.x,
          });
        }

        if (message.value === "fire tower") {
          socket.to(clientRooms[socket.id]).emit("event", {
            key: "tower defense",
            value: "hit unit",
            towerKey: message.towerKey,
            unitKey: message.unitKey,
          });
          //   io.emit("event", {
          //     key: "tower defense",
          //     value: "hit unit",
          //     towerKey: message.towerKey,
          //     unitKey: message.unitKey,
          //   });
        }

      case "background":
        let backgroundName = message.value;
        const roomId = clientRooms[socket.id];

        if (!backgroundState[roomId])
          backgroundState[roomId] = { currentBackground: undefined };

        backgroundState[roomId].currentBackground = backgroundName;

        socket.to(roomId).emit("event", message);
        socket.emit("event", message);
        removeImageAfter1Min(clientRooms[socket.id]);
        break;

      case "whiteboard":
        // socket.broadcast.emit("event", message);
        socket.to(clientRooms[socket.id]).emit("event", message);
        break;
    }
  };
}

const profileOptions = {
  prefixes: [
    "amazing",
    "deranged",
    "charming",
    "dapper",
    "eager",
    "defiant",
    "spotted",
    "rare",
    "sassy",
  ],
  suffixes: [
    "woodpecker",
    "mallard",
    "grasshopper",
    "boar",
    "snail",
    "coyote",
    "meerkat",
    "narwhal",
    "scorpion",
    "walrus",
  ],
  avatars: [
    "kirby",
    "link",
    "mario",
    "nyancat",
    "ghost",
    "yoshi",
    "character1",
    "character2",
    "character3",
    "character4",
    "character5",
    "character6",
    "character7",
  ],
};

const selectedAvatars: { [avatar: string]: string } = {};
const clientProfiles: { [key: string]: { name: string; avatar: string } } = {};

const createProfile = (client: Socket) => {
  const username =
    profileOptions.prefixes[
      Math.floor(Math.random() * profileOptions.prefixes.length)
    ] +
    " " +
    profileOptions.suffixes[
      Math.floor(Math.random() * profileOptions.suffixes.length)
    ];

  const selectedAvatarsValues = Object.values(selectedAvatars);

  let newAvatar = "";

  // basic attempt to prevent duplicate sprites, not checking for different rooms
  if (selectedAvatarsValues.length >= profileOptions.avatars.length) {
    newAvatar =
      profileOptions.avatars[
        Math.floor(Math.random() * profileOptions.avatars.length)
      ];
  } else {
    const availableAvatars = profileOptions.avatars.filter(
      (avatar) => !selectedAvatarsValues.includes(avatar)
    );
    newAvatar =
      availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
  }

  selectedAvatars[client.id] = newAvatar;

  clientProfiles[client.id] = {
    name: username,
    avatar: newAvatar,
  };
};

const spawnEnemy = (roomId: string) => {
  const towerDefenseStateRoom = towerDefenseState[roomId];
  const enemy: ITowerUnit = {
    key: uuidv4(),
    type: "grunt",
  };

  towerDefenseStateRoom.units.push(enemy);

  //   io.emit("event", { key: "tower defense", value: "spawn enemy", enemy });
  io.to(roomId).emit("event", {
    key: "tower defense",
    value: "spawn enemy",
    enemy,
  });
};

const fireTowers = (roomId: string) => {
  //   io.emit("event", { key: "tower defense", value: "fire towers" });
  io.to(roomId).emit("event", { key: "tower defense", value: "fire towers" });
};

const GAME_LENGTH_SECONDS = 5;

const startGame = (roomId: string) => {
  //   io.emit("event", { key: "tower defense", value: "start" });
  //   io.to(roomId).emit("event", { key: "tower defense", value: "start" });

  const towerDefenseStateRoom = towerDefenseState[roomId];

  towerDefenseStateRoom.isPlaying = true;

  if (towerDefenseStateRoom.towerDefenseGameInterval) {
    clearInterval(towerDefenseStateRoom.towerDefenseGameInterval);
    towerDefenseStateRoom.loopCounter = 0;
  }

  towerDefenseStateRoom.towerDefenseGameInterval = setInterval(() => {
    const { loopCounter } = towerDefenseStateRoom;

    let spawnRate = 0;

    if (loopCounter < 10) {
      spawnRate = spawnRates[10];
    } else if (loopCounter < 25) {
      spawnRate = spawnRates[25];
    } else if (loopCounter < 45) {
      spawnRate = spawnRates[45];
    } else if (loopCounter < 60) {
      spawnRate = spawnRates[60];
    } else if (loopCounter < 80) {
      spawnRate = spawnRates[80];
    } else if (loopCounter < 120) {
      spawnRate = spawnRates[100];
    }

    if (Math.random() < spawnRate) {
      spawnEnemy(roomId);
    }

    // fire every 4 seconds
    if (loopCounter % 4 === 0) {
      fireTowers(roomId);
    }

    towerDefenseStateRoom.loopCounter++;

    if (towerDefenseStateRoom.loopCounter === GAME_LENGTH_SECONDS) {
      endGame(roomId);
    }
  }, 1000);
};

const endGame = (roomId: string) => {
  const towerDefenseStateRoom = towerDefenseState[roomId];

  if (towerDefenseStateRoom.towerDefenseGameInterval) {
    clearInterval(towerDefenseStateRoom.towerDefenseGameInterval);
  }

  towerDefenseState[roomId] = {
    isPlaying: false,
    units: [],
    towers: [],
    loopCounter: 0,
  };

  io.to(roomId).emit("event", { key: "tower defense", value: "end" });
};

const spawnRates: { [timeSeconds: number]: number } = {
  10: 0.2,
  25: 0.3,
  45: 0.4,
  60: 0.5,
  80: 0.6,
  100: 0.7,
};

const removeImageAfter1Min = (roomId: string) => {
  const imageTimeout = backgroundState[roomId].imageTimeout;

  if (imageTimeout) {
    clearTimeout(imageTimeout);
  }

  backgroundState[roomId].imageTimeout = setTimeout(() => {
    if (imageTimeout) {
      clearTimeout(imageTimeout);
    }

    backgroundState[roomId] = {
      currentBackground: DEFAULT_IMAGE_BACKGROUND,
    };

    // io.emit("event", { key: "background", value: DEFAULT_IMAGE_BACKGROUND });
    io.to(roomId).emit("event", {
      key: "background",
      value: DEFAULT_IMAGE_BACKGROUND,
    });
  }, 60000);
};
