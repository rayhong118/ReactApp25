import { useGetFriends } from "./hooks/friendHooks";
import { FriendCard } from "./FriendCard";

export const FriendList = () => {
  const { data: friends } = useGetFriends();

  return (
    <div className="my-4">
      {friends?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
