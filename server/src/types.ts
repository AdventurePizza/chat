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

export type PinTypes = "gif" | "background" | "image" | "text" | "NFT";

export interface IChatRoom {
  name: string;
  isLocked?: boolean;
  lockedOwnerAddress?: string;
}

export const error = (res: Response, message: string) => {
  res.statusMessage = message;
  return res.status(400).end();
};
