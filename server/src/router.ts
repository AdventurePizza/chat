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

const towerDefenseState: ITowerDefenseState = {
  isPlaying: false,
  units: [],
  towers: [],
  loopCounter: 0,
};

interface IMessageEvent {
  key: "sound" | "emoji" | "chat" | "gif" | "tower defense";
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

      if (towerDefenseState.isPlaying) {
        socket.emit("event", { key: "tower defense", value: "start" });
      }

      socket.emit("profile info", clientProfiles[socket.id]);

      socket.broadcast.emit("new user", clientProfiles[socket.id]);

      socket.on("event", (message: IMessageEvent) => {
        this.handleEvent(message, socket);
      });

      socket.on("disconnect", () => {
        io.emit("roommate disconnect", socket.id);
        delete clientProfiles[socket.id];
        delete selectedAvatars[socket.id];
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
        io.emit("event", message);
        break;

      case "gif":
        io.emit("event", message);
        break;

      case "tower defense":
        // console.log("got message ", message);
        if (message.value === "start") {
          if (!towerDefenseState.isPlaying) {
            io.emit("event", { key: "tower defense", value: "start" });
            towerDefenseState.isPlaying = true;

            if (towerDefenseState.towerDefenseGameInterval) {
              clearInterval(towerDefenseState.towerDefenseGameInterval);
              towerDefenseState.loopCounter = 0;
            }

            towerDefenseState.towerDefenseGameInterval = setInterval(() => {
              const { loopCounter } = towerDefenseState;

              //   if (loopCounter % 8 === 0) {
              //     spawnEnemy();
              //   }

              const spawn = enemySpawnTimes[loopCounter * 1000];

              if (spawn) {
                spawnEnemy();
              }
              if (loopCounter % 5 === 0) {
                fireTowers();
              }

              towerDefenseState.loopCounter++;
            }, 1000);
          }
        }
        if (message.value === "add tower") {
          io.emit("event", {
            key: "tower defense",
            value: "add tower",
            x: message.x,
            y: message.y,
            towerKey: uuidv4(),
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
  ],
  avatars: ["kirby", "link", "mario", "nyancat", "ghost", "yoshi"],
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
  //   const enemy: ITowerUnit = {
  //     key: uuidv4(),
  //     type: "grunt",
  //   };

  //   towerDefenseState.units.push(enemy);

  io.emit("event", { key: "tower defense", value: "fire towers" });
};

const enemySpawnTimes: { [key: number]: { type: string }[] } = {
  5000: [
    {
      type: "grunt",
    },
  ],
  10000: [
    {
      type: "grunt",
    },
  ],
  14000: [
    {
      type: "grunt",
    },
  ],
  15000: [
    {
      type: "grunt",
    },
  ],
  20000: [
    {
      type: "grunt",
    },
  ],
  21000: [
    {
      type: "grunt",
    },
  ],
  22000: [
    {
      type: "grunt",
    },
  ],
  27000: [
    {
      type: "grunt",
    },
  ],
  28000: [
    {
      type: "grunt",
    },
  ],
  29000: [
    {
      type: "grunt",
    },
  ],
  35000: [
    {
      type: "grunt",
    },
  ],
  36000: [
    {
      type: "grunt",
    },
  ],
  37000: [
    {
      type: "grunt",
    },
  ],
  38000: [
    {
      type: "grunt",
    },
  ],
};
