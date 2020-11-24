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
