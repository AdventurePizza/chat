import "./App.css";

import React, { useEffect } from "react";

import io from "socket.io-client";

const isDebug = true;
const socketURL = "ws://localhost:8000";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  useEffect(() => {
    function onConnect() {
      console.log("connected to socket");
    }

    socket.on("connect", onConnect);

    //    const onChatMessage = (message: string) => {
    //       setMessages((m) => m.concat(message));
    //     }

    // socket.on("chat-message", onChatMessage);
    // socket.on("command",handleCommand)

    return () => {
      socket.off("connect", onConnect);
      //   socket.off("chat-message",onChatMessage)
      //   socket.off("command", handleCommand)
    };
  }, []);

  return <div className="app"></div>;
}

export default App;
