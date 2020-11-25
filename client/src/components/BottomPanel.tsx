import { Drawer, IconButton } from "@material-ui/core";

import { PanelItemEnum } from "../types";
import React from "react";

interface IPanelProps {
  isOpen: boolean;
  onClick: (key: string, value: string) => void;
  type?: PanelItemEnum;
}

const emojiList: string[] = ["😍", "😎", "👏", "👀", "✨", "🦃"];

export const BottomPanel = ({ isOpen, onClick, type }: IPanelProps) => {
  const renderPanelContent = () => {
    switch (type) {
      case "emoji":
        return (
          <>
            {emojiList.map((emoji) => (
              <div key={emoji} className="bottom-panel-emoji">
                <IconButton onClick={() => onClick("emoji", emoji)}>
                  {emoji}
                </IconButton>
              </div>
            ))}
          </>
        );
    }
  };

  return (
    <Drawer variant="persistent" anchor="bottom" open={isOpen}>
      <div className="bottom-panel-container">{renderPanelContent()}</div>
    </Drawer>
  );
};
