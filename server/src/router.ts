import socketio, { Socket } from "socket.io";

import axios from "axios";
import express from "express";
import fetch from "node-fetch";
import http from "http";
import { sendEmail } from "./email";
import { v4 as uuidv4 } from "uuid";
import authRouter from "./auth";
import usersRouter from "./users";
import cors from "cors";
import * as jwt from "jsonwebtoken";
import roomRouter from "./room";
import tokenRouter from "./token";
import chatroomUserRouter from "./chatroomUsers";
import imageSearchRouter from "./imageSearch";
import { emit } from "process";
import zedrunRouter from "./zedrun";

const WEATHER_APIKEY = "76e1b88bbdea63939ea0dd9dcdc3ff1b";

const expressjwt = require("express-jwt");
const { getMetadata } = require("page-metadata-parser");
const domino = require("domino");

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

const clientPositions: { [clientId: string]: { x: number; y: number } } = {};
const DEFAULT_IMAGE_BACKGROUND = undefined;

const chatMessages: { [userId: string]: string[] } = {};
const clientRooms: { [userId: string]: string } = {};

const KELVIN_FIXED: number = 459.67;

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
  type: string;
}

export interface ITowerBuilding {
  key: string;
  type: string;
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

export interface IWeather {
  temp: string;
  condition: string;
}

let towerDefenseState: ITowerDefenseState = {};

let backgroundState: IBackgroundState = {};

interface IMessageEvent {
  key:
    | "sound"
    | "youtube"
    | "map"
    | "emoji"
    | "chat"
    | "gif"
    | "image"
    | "tower defense"
    | "background"
    | "messages"
    | "whiteboard"
    | "animation"
    | "isTyping"
    | "username"
    | "avatar"
    | "currentRoom"
    | "settings-url"
    | "weather"
    | "pin-item"
    | "move-item"
    | "send-email"
    | "unpin-item"
    | "change-playlist";
  value?: any;
  [key: string]: any;
}

const authenticatedUsers: {
  [wsId: string]: {
    isVerified: boolean;
    publicAddress: string;
  };
} = {};

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    app.use(cors());
    app.use(express.json());
    app.use("/users", usersRouter);
    app.use("/auth", authRouter);
    app.use(
      "/room",
      expressjwt({
        //@ts-ignore
        secret: Buffer.from(process.env.JWT_SECRET, "base64"),
        algorithms: ["HS256"],
        credentialsRequired: false,
      }),
      roomRouter
    );
    app.use(
      "/token",
      expressjwt({
        //@ts-ignore
        secret: Buffer.from(process.env.JWT_SECRET, "base64"),
        algorithms: ["HS256"],
        credentialsRequired: false,
      }),
      tokenRouter
    );

    app.use(
      "/google-image-search",
      expressjwt({
        //@ts-ignore
        secret: Buffer.from(process.env.JWT_SECRET, "base64"),
        algorithms: ["HS256"],
        credentialsRequired: false,
      }),
      imageSearchRouter
    );

    app.use("/chatroom-users", chatroomUserRouter);
    
    app.use("/zedrun/getRaces", zedrunRouter);

    io.on("connect", (socket: Socket) => {
      socket.on("authenticate", ({ token }: { token?: string }) => {
        if (!token) return;

        jwt.verify(
          token,
          //@ts-ignore
          Buffer.from(process.env.JWT_SECRET, "base64"),
          // process.env.JWT_SECRET,
          (err, decoded) => {
            if (!err) {
              authenticatedUsers[socket.id] = {
                isVerified: true,
                //@ts-ignore
                publicAddress: decoded.payload.publicAddress,
              };
            } else console.log(err);
          }
        );
      });

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

          if (backgroundState[roomId]) {
            socket.emit("event", {
              key: "background",
              value: backgroundState[roomId].currentBackground,
            });
          }

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
              towers: towerDefenseState[roomId].towers,
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
        delete authenticatedUsers[socket.id];
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

  handleEvent = async (message: IMessageEvent, socket: Socket) => {
    const room = clientRooms[socket.id];
    switch (message.key) {
      case "map":
        socket.to(room).broadcast.emit("event", message);
        break;

      case "youtube":
        socket.to(room).broadcast.emit("event", message);
        break;

      case "sound":
        // socket.broadcast.emit("event", message);
        // socket.to(room).broadcast.emit("event", message);
        socket.to(room).emit("event", {
          key: "sound",
          userId: socket.id,
          value: message.value,
        });
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
          avatar: message.avatar,
        });

        if (message.value) {
          chatMessages[socket.id].push(message.value);
        }
        break;

      case "gif":
        const gifKey = uuidv4();
        const newMessage = {
          ...message,
          gifKey,
        };
        socket.to(room).emit("event", newMessage);
        socket.emit("event", newMessage);
        break;

      case "image":
        const imageKey = uuidv4();
        const newImageMessage = {
          ...message,
          imageKey,
        };
        socket.to(room).emit("event", newImageMessage);
        socket.emit("event", newImageMessage);
        break;

      case "move-item":
        socket.to(room).emit("event", message);
        break;
      case "send-email":
        sendEmail(message.to, message.message, message.url);
        break;

      case "pin-item":
        if (message.type === "background") {
          if (!backgroundState[room]) {
            backgroundState[room] = { currentBackground: undefined };
          }

          if (backgroundState[room].imageTimeout) {
            clearTimeout(backgroundState[room].imageTimeout!);
          }

          socket.to(room).emit("event", { ...message, isPinned: true });
        } else if (message.type === "text") {
          const chatPinMessage = {
            ...message,
            userId: socket.id,
          };
          socket.to(room).emit("event", chatPinMessage);
          socket.emit("event", chatPinMessage);
        } else {
          socket.to(room).emit("event", message);
          socket.emit("event", message);
        }
        break;
      case "unpin-item":
        if (message.type === "background") {
          if (!backgroundState[room]) {
            backgroundState[room] = { currentBackground: undefined };
          }
          backgroundState[room].currentBackground = undefined;

          if (backgroundState[room].imageTimeout) {
            clearTimeout(backgroundState[room].imageTimeout!);
          }
        }
        socket.to(room).emit("event", message);
        socket.emit("event", message);
        break;

      case "isTyping":
        socket.to(room).emit("event", { ...message, id: socket.id });
        break;

      case "username":
        socket.to(room).emit("event", { ...message, id: socket.id });
        clientProfiles[socket.id].name = message.value as string;
        break;
      case "avatar":
        socket.to(room).emit("event", { ...message, id: socket.id });
        clientProfiles[socket.id].avatar = message.value as string;
        break;
      case "currentRoom":
        socket.to(room).emit("event", { ...message, id: socket.id });
        clientProfiles[socket.id].currentRoom = message.value as string;
        break;
      case "settings-url":
        const metadata = await resolveUrl(message.value as string);
        clientProfiles[socket.id].musicMetadata = metadata;
        const emitData = {
          key: "settings-url",
          id: socket.id,
          value: metadata,
        };
        socket.to(room).emit("event", emitData);

        socket.emit("event", { ...emitData, isSelf: true });
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
          socket.emit("event", {
            key: "tower defense",
            value: "hit unit",
            towerKey: message.towerKey,
            unitKey: message.unitKey,
          });
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
      case "weather":
        axios
          .get(
            `http://api.openweathermap.org/data/2.5/weather?q=${message.value}&appid=${WEATHER_APIKEY}`
          )
          .then((res) => {
            let temp = res.data.main.temp;
            let condition = res.data.weather[0].main;

            socket.to(room).emit("event", {
              key: "weather",
              value: {
                temp: convertKelToFar(temp, KELVIN_FIXED),
                condition: condition,
              },
              id: socket.id,
            });

            io.to(socket.id).emit("event", {
              key: "weather",
              value: {
                temp: convertKelToFar(temp, KELVIN_FIXED),
                condition: condition,
              },
              toSelf: true,
            });
            clientProfiles[socket.id].weather = {
              temp: convertKelToFar(temp, KELVIN_FIXED),
              condition: condition,
            };
          })
          .catch((error) => {
            console.error(error.response.data);
          });

        break;
      case "animation":
        socket.to(room).broadcast.emit("event", message);
        break;
      case "change-playlist":
        socket.to(room).broadcast.emit("event", message);
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
    "character8",
  ],
};

const selectedAvatars: { [avatar: string]: string } = {};
const clientProfiles: {
  [key: string]: {
    name: string;
    avatar: string;
    musicMetadata?: IMetadata;
    weather?: IWeather;
    currentRoom: string
  };
} = {};

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
    weather: { temp: "", condition: "" },
    currentRoom: "default"
  };
}; 

const spawnEnemy = (roomId: string) => {
  const towerDefenseStateRoom = towerDefenseState[roomId];
  const enemy: ITowerUnit = {
    key: uuidv4(),
    type: Math.random() < 0.5 ? "grunt" : "pepeNaruto",
  };

  towerDefenseStateRoom.units.push(enemy);

  //   io.emit("event", { key: "tower defense", value: "spawn enemy", enemy });
  io.to(roomId).emit("event", {
    key: "tower defense",
    value: "spawn enemy",
    enemy,
  });
};

const fireTowers = (roomId: string, towerTypes: string[]) => {
  io.to(roomId).emit("event", {
    key: "tower defense",
    value: "fire towers",
    towerTypes: towerTypes,
  });
};

const GAME_LENGTH_SECONDS = 120;

// assuming same enemies
const enemySpawnRates = [6, 5, 4, 3, 2, 1];

let waveCount = 0;
const waveLengthSec = 20;

const startGame = (roomId: string) => {
  const towerDefenseStateRoom = towerDefenseState[roomId];

  towerDefenseStateRoom.isPlaying = true;

  if (towerDefenseStateRoom.towerDefenseGameInterval) {
    clearInterval(towerDefenseStateRoom.towerDefenseGameInterval);
    towerDefenseStateRoom.loopCounter = 0;
  }

  towerDefenseStateRoom.towerDefenseGameInterval = setInterval(() => {
    const { loopCounter } = towerDefenseStateRoom;

    const enemySpawnRate = enemySpawnRates[waveCount];

    if (loopCounter % enemySpawnRate === 0) {
      spawnEnemy(roomId);
    }

    let towerTypes: string[] = [];

    // fire every 4 seconds
    if (loopCounter % 4 === 0) {
      towerTypes.push("basic");
    }

    // fire every 3 seconds
    if (loopCounter % 3 === 0) {
      towerTypes.push("bowman");
    }

    if (towerTypes.length > 0) fireTowers(roomId, towerTypes);

    towerDefenseStateRoom.loopCounter++;

    if (towerDefenseStateRoom.loopCounter % waveLengthSec === 0) {
      waveCount++;
    }

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

  waveCount = 0;

  io.to(roomId).emit("event", { key: "tower defense", value: "end" });
};

const BACKGROUND_TIMEOUT = 60000;

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
  }, BACKGROUND_TIMEOUT);
};

const convertKelToFar = (temp: number, KELVIN_FIXED: number) => {
  temp = Math.floor(temp * (9 / 5) - 459.67);

  return temp.toString();
};

interface IMetadata {
  description: string;
  icon: string;
  image: string;
  title: string;
  url: string;
  type: string;
  provider: string;
}

const urls: { [url: string]: IMetadata } = {};

const resolveUrl = async (url: string): Promise<IMetadata> => {
  let metadata = urls[url];
  if (!metadata) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = domino.createWindow(html).document;
      metadata = getMetadata(doc, url);

      urls[url] = metadata;
    } catch (e) {
      console.log("error resolving url: ", e);
    }
  }
  return Promise.resolve(metadata);
};

// typing for jwt which puts payload on req.user
declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
    export interface Response {
      user: any;
    }
  }
}
