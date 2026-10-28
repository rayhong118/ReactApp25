import type { Timestamp } from "firebase/firestore";

export interface IFriend {
  id: string;
  alias?: string;
  color?: string;
  searchAlias?: string;
}

export interface IFriendList {
  [key: string]: IFriend;
}

export interface IFriendRequest {
  id: string;
  type: "sent" | "received";
  senderId: string;
  senderAlias?: string;
  senderColor?: string;
  receiverId: string;
  receiverAlias?: string;
  receiverColor?: string;
  status: "pending" | "accepted" | "rejected";
  addedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IFriendRequestRecord {
  sent: IFriendRequest[];
  received: IFriendRequest[];
}

export interface IUser {
  id: string;
  alias?: string;
  color?: string;
  friendIds?: string[];
  searchAlias?: string;
  notifications?: any[];
  email?: string;
  searchEmail?: string;
}

export type LocalLlmTaskFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export type LocalLlmTaskStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "NO_RESULT"
  | "FAILED"
  | "DAILY"
  | "CANCELLED";

export interface ILocalLlmTaskOutput {
  id: number;
  task_id?: number;
  content: string;
  created_at: string;
}

export interface ILocalLlmContext {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

export interface ILocalLlmTask {
  id: number;
  prompt: string;
  status: LocalLlmTaskStatus;
  frequency: LocalLlmTaskFrequency;
  hour_of_day: number | null;
  day_of_week?: number | null;
  day_of_month?: number | null;
  weekday_only?: boolean;
  silent_if_no_result?: boolean;
  max_history_runs?: number | null;
  next_run_at: string | null;
  started_at: string | null;
  created_at: string;
  updated_at: string;
  parent_id?: number | null;
  outputs: ILocalLlmTaskOutput[];
  contexts?: ILocalLlmContext[];
}

export interface ILocalLlmDashboardData {
  tasks: ILocalLlmTask[];
  contexts: ILocalLlmContext[];
}
