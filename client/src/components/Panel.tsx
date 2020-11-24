import "./Panel.css";

import {
  Chat,
  ChevronRight,
  Gif,
  InsertEmoticon,
  Palette,
} from "@material-ui/icons/";
import { Drawer, IconButton, Tooltip } from "@material-ui/core";
import React, { useRef } from "react";

import drum from "../assets/drum.svg";
//@ts-ignore
import drumBeat from "../assets/drumbeat.mp3";

const iconStyle: React.CSSProperties = {
  width: 50,
  height: 50,
  marginTop: 10,
};

interface IPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (key: string) => void;
}

const panelItems: { key: string; icon?: React.ReactNode; img?: string }[] = [
  {
    key: "sound",
    img: drum,
  },
  {
    key: "emoji",
    icon: <InsertEmoticon style={iconStyle} />,
  },
  {
    key: "color",
    icon: <Palette style={iconStyle} />,
  },
  {
    key: "gifs",
    icon: <Gif style={iconStyle} />,
  },
  {
    key: "chat",
    icon: <Chat style={iconStyle} />,
  },
];

export const Panel = ({ isOpen, onClose, onClick }: IPanelProps) => {
  const audio = useRef<HTMLAudioElement>(new Audio(drumBeat));

  const onClickItem = (key: string) => {
    switch (key) {
      case "sound":
        audio.current.currentTime = 0;
        audio.current.play();
        onClick(key);
        break;
    }
  };

  return (
    <Drawer variant="persistent" anchor="right" open={isOpen}>
      <div className="panel-container">
        <Tooltip title="close panel">
          <IconButton style={{ marginTop: 20 }} onClick={onClose}>
            <ChevronRight />
          </IconButton>
        </Tooltip>
        {panelItems.map((item) => (
          <PanelItem
            {...item}
            key={item.key}
            title={item.key}
            onClick={() => onClickItem(item.key)}
          />
        ))}
      </div>
    </Drawer>
  );
};

interface IPanelItemProps {
  icon?: React.ReactNode;
  img?: string;
  onClick: () => void;
  title: string;
}

const PanelItem = ({ title, icon, img, onClick }: IPanelItemProps) => {
  return (
    <Tooltip title={title}>
      <div>
        {
          <IconButton onClick={onClick}>
            {icon}
            {img && <img style={iconStyle} src={img} alt={title} />}
          </IconButton>
        }
      </div>
    </Tooltip>
  );
};
