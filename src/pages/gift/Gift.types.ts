import type { Timestamp } from "firebase/firestore";

export interface IGift {
  id?: string;
  type: "preferred" | "avoid";
  name: string;
  description?: string;
  addedAt?: Timestamp;
  isFulfilled: boolean;
  fulfilledAt?: Timestamp;
}

export interface IGiftList {
  [giftId: string]: IGift;
}
