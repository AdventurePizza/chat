import "./Panel.css";

import {
  Chat,
  ChevronRight,
  Gif,
  InsertEmoticon,
  Palette,
} from "@material-ui/icons/";
import { Drawer, IconButton, Tooltip } from "@material-ui/core";

import React from "react";
import drum from "../assets/drum.svg";

const iconStyle: React.CSSProperties = {
  width: 50,
  height: 50,
  marginTop: 10,
};

interface IPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const panelItems: { key: string; icon?: React.ReactNode; img?: string }[] = [
  {
    key: "sound",
    img: drum,
  },
  {
    key: "color",
    icon: <Palette style={iconStyle} />,
  },
  {
    key: "emoji",
    icon: <InsertEmoticon style={iconStyle} />,
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

export const Panel = ({ isOpen, onClose }: IPanelProps) => {
  const onClickItem = (key: string) => {
    console.log("clicked ", key);
  };

  return (
    <Drawer variant="persistent" anchor="right" open={isOpen}>
      <div className="panel-container">
        <IconButton style={{ marginTop: 20 }} onClick={onClose}>
          <ChevronRight />
        </IconButton>
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
        {icon && <IconButton onClick={onClick}>{icon}</IconButton>}
        {img && <img style={iconStyle} src={img} alt={title} />}
      </div>
    </Tooltip>
  );
};
