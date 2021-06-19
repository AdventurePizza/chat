import { IGif } from "@giphy/js-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      FIREBASE_CONFIG_BASE64: string;
      JWT_SECRET: string;
      INFURA_SECRET: string;
      //   IS_LOCAL: boolean;
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
