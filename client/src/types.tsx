export interface IMessageEvent {
  key: "sound" | "emoji";
  value?: string;
}

export interface IEmoji {
  top: number;
  left: number;
  key: string;
  type: string;
}

export enum PanelItemEnum {
  "sound" = "sound",
  "emoji" = "emoji",
  "color" = "color",
  "gifs" = "gifs",
  "chat" = "chat",
}
