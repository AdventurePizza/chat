import socketio, { Socket } from "socket.io";

import express from "express";
import http from "http";

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: Socket) => {
      console.log("connected socket");
      socket.on("chat-message", (message: string) => {
        if (isCommand(message)) {
          this.handleCommand(message, socket);
        } else {
          io.emit("chat-message", message);
        }

        // socket.broadcast.emit("chat-message", message);
      });
    });
  }

  handleCommand = (message: string, socket: Socket) => {
    const strs = message.split(" ");

    if (strs.length < 2) {
      return;
    }

    const command = strs[0].substring(1);

    if (command === "play") {
      io.emit("command", { command: "play", url: strs[1] });
    }
  };
}

const isCommand = (message: string) => message.startsWith("!");
