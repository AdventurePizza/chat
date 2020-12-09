import socketio, { Socket } from "socket.io";

import express from "express";
import http from "http";

const IS_DEBUG = false;

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

const clientPositions: { [clientId: string]: { x: number; y: number } } = {};

interface IMessageEvent {
  key: "sound" | "emoji" | "chat" | "gif";
  value?: string;
}

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: Socket) => {
      IS_DEBUG && console.log("connected user");

      createProfile(socket);

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
