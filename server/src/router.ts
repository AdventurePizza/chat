import socketio, { Socket } from "socket.io";

import express from "express";
import http from "http";

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

interface IMessageEvent {
  key: "sound" | "emoji" | "chat" | "gif" | "background";
  value?: string;
}

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: Socket) => {
      socket.on("event", (message: IMessageEvent) => {
        this.handleEvent(message, socket);
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

      case "background":
        io.emit("event", message);
        break;
    }
  };
}
