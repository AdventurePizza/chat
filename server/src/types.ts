import { IGif } from "@giphy/js-types";
import { Response } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      FIREBASE_CONFIG_BASE64: string;
      JWT_SECRET: string;
      INFURA_SECRET: string;
      TWITTER_API_KEY: string;
      TWITTER_API_SECRET_KEY: string;
      TWITTER_BEARER_TOKEN: string;
      TWITTER_ACCESS_TOKEN: string;
      TWITTER_TOKEN_SECRET: string;
      NODE_ENV: string;
    }
  }
}
export interface IPinnedItem {
  type: PinTypes;
  top: number;
  left: number;
  key?: string;
  data?: IGif;
  [key: string]: any;
}

export type PinTypes = "gif" | 'race' | "background" | "image" | "text" | "NFT";

export interface IChatRoom {
  name: string;
  isLocked?: boolean;
  lockedOwnerAddress?: string;
  contractAddress?: string;
}

export const error = (res: Response, message: string) => {
  res.statusMessage = message;
  return res.status(400).end();
};

export interface IMap {
  coordinates: { lat: number; lng: number };
  markers: Array<{ lat: number; lng: number; text?: string }>;
  zoom: number;
}

export interface IBackgroundState {
  type?: "image" | "map";
  name?: string;
  isPinned?: boolean;
  mapData?: IMap;
}
