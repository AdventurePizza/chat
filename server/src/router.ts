import socketio, { Socket } from "socket.io";

import express from "express";
import http from "http";

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

interface IMessageEvent {
  key: "sound";
}

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: Socket) => {
      console.log("connected socket");
      socket.on("event", (message: IMessageEvent) => {
        this.handleEvent(message, socket);
      });
    });
  }

  handleEvent = (message: IMessageEvent, socket: Socket) => {
    if (message.key === "sound") {
      console.log("got event", message);
      socket.broadcast.emit("event", message);
    }
  };
}
