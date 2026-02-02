import { useGetFriends } from "./hooks/friendHooks";

export const FriendList = () => {
  const { data: friends } = useGetFriends();

  return (
    <div className="my-4">
      {friends?.map((friend) => (
        <div key={friend.id} className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full object-cover"
            style={{ backgroundColor: friend.color || "#eee" }}
          />
          <span className="text-lg font-semibold">{friend.alias}</span>
        </div>
      ))}
    </div>
  );
};
