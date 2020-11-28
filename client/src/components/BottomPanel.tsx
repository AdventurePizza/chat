import { Drawer, IconButton } from "@material-ui/core";

import { Chat } from "./Chat";
import { PanelItemEnum } from "../types";
import React from "react";
import { Gifs } from "./Gifs";

interface IPanelProps {
  isOpen: boolean;
  type?: PanelItemEnum;
  onAction: (key: string, ...args: any[]) => void;
}

const emojiList: string[] = ["😍", "😎", "👏", "👀", "✨", "🦃"];

export const BottomPanel = ({ isOpen, type, onAction }: IPanelProps) => {
  const renderPanelContent = () => {
    switch (type) {
      case "emoji":
        return (
          <>
            {emojiList.map((emoji) => (
              <div key={emoji} className="bottom-panel-emoji">
                <IconButton onClick={() => onAction("emoji", emoji)}>
                  {emoji}
                </IconButton>
              </div>
            ))}
          </>
        );

      case "chat":
        return (
          <Chat
            sendMessage={(message) => {
              onAction("chat", message);
            }}
          />
        );
      case "gifs":
        return(
          <Gifs
            sendGif={(gif) => {
              onAction("gif", gif);
            }}
          />
        );
    }
  };

  return (
    <Drawer variant="persistent" anchor="bottom" open={isOpen}>
      <div className="bottom-panel-container">{renderPanelContent()}</div>
    </Drawer>
  );
};
