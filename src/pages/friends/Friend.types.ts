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
  type: "sent" | "received";
  senderId: string;
  senderAlias?: string;
  senderAvatar?: string;
  receiverId: string;
  receiverAlias?: string;
  receiverAvatar?: string;
  status: "pending" | "accepted" | "rejected";
  addedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IFriendRequestRecord {
  sent: IFriendRequest[];
  received: IFriendRequest[];
}
