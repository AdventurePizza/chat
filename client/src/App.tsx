import "./App.css";

import { IconButton, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { Board } from "./components/Board";
import { ChevronLeft } from "@material-ui/icons";
import { IMusicNoteProps } from "./components/MusicNote";
import { Panel } from "./components/Panel";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const isDebug = true;

const socketURL =
  window.location.hostname === "localhost"
    ? "ws://localhost:8000"
    : "wss://yeeplayer.herokuapp.com";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);

  const onClickPanelItem = (key: string) => {
    if (key === "sound") {
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;

      setMusicNotes(
        musicNotes.concat({ top: randomY, left: randomX, key: uuidv4() })
      );
    }
  };

  console.log(" notes are ", musicNotes);

  useEffect(() => {
    function onConnect() {
      console.log("connected to socket");
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  return (
    <div className="app" style={{ minHeight: window.innerHeight - 10 }}>
      <Board musicNotes={musicNotes} updateNotes={setMusicNotes} />

      <div className="open-panel-button">
        {!isPanelOpen && (
          <Tooltip title="open panel">
            <IconButton
              onClick={() => {
                setIsPanelOpen(true);
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Panel
        onClick={onClickPanelItem}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
        }}
      />
    </div>
  );
}

export default App;
