import { useGetFriends } from "./hooks/friendHooks";
import { FriendCard } from "./FriendCard";
import { Loading } from "@/components/Loading";

export const FriendList = () => {
  const { data: friends, isLoading } = useGetFriends();

  return (
    <div className="my-4">
      {isLoading && <Loading />}
      {friends?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
