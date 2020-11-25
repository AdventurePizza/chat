import "./App.css";

import { IChatMessage, IEmoji, IMessageEvent, PanelItemEnum } from "./types";
import { IconButton, Tooltip } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Board } from "./components/Board";
import { BottomPanel } from "./components/BottomPanel";
import { ChevronLeft } from "@material-ui/icons";
import { IMusicNoteProps } from "./components/MusicNote";
import { Panel } from "./components/Panel";
//@ts-ignore
import drumBeat from "./assets/drumbeat.mp3";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const isDebug = false;

const socketURL =
  window.location.hostname === "localhost"
    ? "ws://localhost:8000"
    : "wss://adventure-chat.herokuapp.com";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

const generateRandomXY = (centered?: boolean) => {
  if (centered) {
    // 1/4 to 3/4

    const randomX =
      (Math.random() * window.innerWidth * 2) / 4 + window.innerWidth / 4;
    const randomY =
      (Math.random() * window.innerHeight * 2) / 4 + window.innerHeight / 4;

    //1/3 to 2/3

    // const randomX =
    //   (Math.random() * window.innerWidth) / 3 + window.innerWidth / 3;
    // const randomY =
    //   (Math.random() * window.innerHeight) / 3 + window.innerHeight / 3;

    return { x: randomX, y: randomY };
  } else {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    return { x: randomX, y: randomY };
  }
};

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);
  const [emojis, setEmojis] = useState<IEmoji[]>([]);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [selectedPanelItem, setSelectedPanelItem] = useState<PanelItemEnum>();

  const audio = useRef<HTMLAudioElement>(new Audio(drumBeat));

  const playEmoji = useCallback((type: string) => {
    const { x, y } = generateRandomXY();

    setEmojis((emojis) =>
      emojis.concat({ top: y, left: x, key: uuidv4(), type })
    );
  }, []);

  const playSound = useCallback(() => {
    if (!audio || !audio.current) return;

    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;

    setMusicNotes((notes) =>
      notes.concat({ top: randomY, left: randomX, key: uuidv4() })
    );

    audio.current.currentTime = 0;
    audio.current.play();
  }, [audio]);

  const onClickPanelItem = (key: string) => {
    switch (key) {
      case "sound":
        playSound();

        socket.emit("event", {
          key: "sound",
        });
        break;

      case "emoji":
      case "chat":
        setSelectedPanelItem(
          selectedPanelItem === key ? undefined : (key as PanelItemEnum)
        );

        break;
    }
  };

  const addChatMessage = useCallback((message: string) => {
    const { x, y } = generateRandomXY(true);
    const newMessage: IChatMessage = {
      top: y,
      left: x,
      key: uuidv4(),
      value: message,
    };
    setChatMessages((chatMessages) => chatMessages.concat(newMessage));
  }, []);

  useEffect(() => {
    function onConnect() {
      isDebug && console.log("connected to socket");
    }

    const onMessageEvent = (message: IMessageEvent) => {
      switch (message.key) {
        case "sound":
          playSound();
          break;
        case "emoji":
          if (message.value) {
            playEmoji(message.value);
          }
          break;
        case "chat":
          if (message.value) {
            addChatMessage(message.value);
          }
          break;
      }
    };

    socket.on("connect", onConnect);

    socket.on("event", onMessageEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("event", onMessageEvent);
    };
  }, [playEmoji, playSound, addChatMessage]);

  const actionHandler = (key: string, ...args: any[]) => {
    switch (key) {
      case "chat":
        const chatValue = args[0] as string;
        socket.emit("event", {
          key: "chat",
          value: chatValue,
        });
        break;
      case "emoji":
        const emoji = args[0] as string;
        playEmoji(emoji);
        socket.emit("event", {
          key: "emoji",
          value: emoji,
        });
    }
  };

  return (
    <div className="app" style={{ minHeight: window.innerHeight - 10 }}>
      <Board
        musicNotes={musicNotes}
        updateNotes={setMusicNotes}
        emojis={emojis}
        updateEmojis={setEmojis}
        chatMessages={chatMessages}
        updateChatMessages={setChatMessages}
      />

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
        selectedItem={selectedPanelItem}
      />

      <BottomPanel
        type={selectedPanelItem}
        isOpen={Boolean(selectedPanelItem)}
        onAction={actionHandler}
      />
    </div>
  );
}

export default App;
