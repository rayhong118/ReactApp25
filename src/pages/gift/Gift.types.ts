export interface IGift {
  id?: string;
  type: "preferred" | "avoid";
  name: string;
  description?: string;
  addedAt?: Date;
  isFulfilled: boolean;
  fulfilledAt?: Date;
}

export interface IGiftList {
  [giftId: string]: IGift;
}
