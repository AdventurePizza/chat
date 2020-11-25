export interface IMessageEvent {
  key: "sound" | "emoji" | "chat";
  value?: string;
}

export interface IEmoji {
  top: number;
  left: number;
  key: string;
  type: string;
}

export interface IChatMessage {
  top: number;
  left: number;
  key: string;
  value: string;
}

export enum PanelItemEnum {
  "sound" = "sound",
  "emoji" = "emoji",
  "color" = "color",
  "gifs" = "gifs",
  "chat" = "chat",
}
