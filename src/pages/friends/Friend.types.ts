import type { Timestamp } from "firebase/firestore";

export interface IFriend {
  id: string;
  alias?: string;
}

export interface IFriendList {
  [key: string]: IFriend;
}

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  addedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IFriendRequestRecord {
  sent: IFriendRequest[];
  received: IFriendRequest[];
}
