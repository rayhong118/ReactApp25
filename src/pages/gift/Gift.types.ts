export interface IGift {
  type: "preferred" | "avoid";
  name: string;
  description?: string;
  addedAt: Date;
  isFulfilled: boolean;
  fulfilledAt?: Date;
}
