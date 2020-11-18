import "./App.css";

import React, { useEffect, useState } from "react";

import { ChevronLeft } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Panel } from "./components/Panel";
import io from "socket.io-client";

const isDebug = true;

const socketURL =
  window.location.hostname === "localhost"
    ? "ws://localhost:8000"
    : "wss://yeeplayer.herokuapp.com";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

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

  return (
    <div className="app">
      <div className="open-panel-button">
        {!isPanelOpen && (
          <IconButton
            onClick={() => {
              setIsPanelOpen(true);
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </div>
      <Panel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
        }}
      />
    </div>
  );
}

export default App;
