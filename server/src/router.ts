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

export interface IBackgroundState {
  imageTimeout?: NodeJS.Timeout;
  currentBackground: string | undefined;
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

export interface ITowerDefenseState {
  isPlaying: boolean;
  units: ITowerUnit[];
  towers: ITowerBuilding[];
  towerDefenseGameInterval?: NodeJS.Timeout;
  loopCounter: number;
}

let towerDefenseState: ITowerDefenseState = {
  isPlaying: false,
  units: [],
  towers: [],
  loopCounter: 0,
};

let backgroundState: IBackgroundState = {
  currentBackground: DEFAULT_IMAGE_BACKGROUND,
};

interface IMessageEvent {
  key:
    | "sound"
    | "emoji"
    | "chat"
    | "gif"
    | "tower defense"
    | "background"
    | "messages";
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

      if (towerDefenseState.isPlaying) {
        socket.emit("event", { key: "tower defense", value: "start" });
        socket.emit("event", {
          key: "tower defense",
          value: "towers",
          towers: towerDefenseState.towers,
        });
      }

      // So you only need to change the server for having a different DEFAULT_IMAGE_BACKGROUND, client will prevent unnecessary background changes
      // Although, the client still needs to have the image in "BackgroundImages.ts"
      socket.emit("event", {
        key: "background",
        value: backgroundState.currentBackground,
      });

      socket.emit("profile info", clientProfiles[socket.id]);

      socket.broadcast.emit("new user", clientProfiles[socket.id]);

      socket.on("event", (message: IMessageEvent) => {
        this.handleEvent(message, socket);
      });

      socket.on("disconnect", () => {
        io.emit("roommate disconnect", socket.id);
        delete clientProfiles[socket.id];
        delete selectedAvatars[socket.id];
        delete chatMessages[socket.id];
      });

      socket.on("cursor move", (data) => {
        const { x, y } = data;
        clientPositions[socket.id] = { x, y };

        socket.broadcast.emit(
          "cursor move",
          socket.id,
          [x, y],
          clientProfiles[socket.id]
        );
      });
    });
  }

  handleEvent = (message: IMessageEvent, socket: Socket) => {
    switch (message.key) {
      case "sound":
        socket.broadcast.emit("event", message);
        break;

      case "emoji":
        socket.broadcast.emit("event", message);
        break;

      case "chat":
        io.emit("event", {
          key: "chat",
          userId: socket.id,
          value: message.value,
        });

        if (message.value) {
          chatMessages[socket.id].push(message.value);
        }
        break;

      case "gif":
        io.emit("event", message);
        break;

      case "tower defense":
        if (message.value === "start" && !towerDefenseState.isPlaying) {
          startGame();
        }
        if (message.value === "add tower") {
          io.emit("event", {
            key: "tower defense",
            value: "add tower",
            x: message.x,
            y: message.y,
            towerKey: uuidv4(),
          });

          towerDefenseState.towers.push({
            key: uuidv4(),
            type: "basic",
            top: message.y,
            left: message.x,
          });
        }

        if (message.value === "fire tower") {
          io.emit("event", {
            key: "tower defense",
            value: "hit unit",
            towerKey: message.towerKey,
            unitKey: message.unitKey,
          });
        }

      case "background":
        let backgroundName = message.value;
        backgroundState.currentBackground = backgroundName;
        io.emit("event", message);
        removeImageAfter1Min();
        break;

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

const spawnEnemy = () => {
  const enemy: ITowerUnit = {
    key: uuidv4(),
    type: "grunt",
  };

  towerDefenseState.units.push(enemy);

  io.emit("event", { key: "tower defense", value: "spawn enemy", enemy });
};

const fireTowers = () => {
  io.emit("event", { key: "tower defense", value: "fire towers" });
};

const GAME_LENGTH_SECONDS = 120;

const startGame = () => {
  io.emit("event", { key: "tower defense", value: "start" });

  towerDefenseState.isPlaying = true;

  if (towerDefenseState.towerDefenseGameInterval) {
    clearInterval(towerDefenseState.towerDefenseGameInterval);
    towerDefenseState.loopCounter = 0;
  }

  towerDefenseState.towerDefenseGameInterval = setInterval(() => {
    const { loopCounter } = towerDefenseState;

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
      spawnEnemy();
    }

    // fire every 4 seconds
    if (loopCounter % 4 === 0) {
      fireTowers();
    }

    towerDefenseState.loopCounter++;

    if (towerDefenseState.loopCounter === GAME_LENGTH_SECONDS) {
      endGame();
    }
  }, 1000);
};

const endGame = () => {
  if (towerDefenseState.towerDefenseGameInterval) {
    clearInterval(towerDefenseState.towerDefenseGameInterval);
  }

  towerDefenseState = {
    isPlaying: false,
    units: [],
    towers: [],
    loopCounter: 0,
  };

  io.emit("event", { key: "tower defense", value: "end" });
};

const spawnRates: { [timeSeconds: number]: number } = {
  10: 0.2,
  25: 0.3,
  45: 0.4,
  60: 0.5,
  80: 0.6,
  100: 0.7,
};

const removeImageAfter1Min = () => {
  if (backgroundState.imageTimeout) {
    clearTimeout(backgroundState.imageTimeout);
  }

  backgroundState.imageTimeout = setTimeout(() => {
    removeImage();
  }, 60000);
};

const removeImage = () => {
  if (backgroundState.imageTimeout) {
    clearTimeout(backgroundState.imageTimeout);
  }

  backgroundState = {
    currentBackground: DEFAULT_IMAGE_BACKGROUND,
  };

  io.emit("event", { key: "background", value: DEFAULT_IMAGE_BACKGROUND });
};
