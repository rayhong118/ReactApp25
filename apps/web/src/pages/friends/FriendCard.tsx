import type { IFriend } from "./Friend.types";

export const FriendCard = ({ friend }: { friend: IFriend }) => {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-8 h-8 rounded-full object-cover"
        style={{ backgroundColor: friend.color || "#eee" }}
      />
      <span className="text-lg font-semibold">{friend.alias}</span>
    </div>
  );
};
