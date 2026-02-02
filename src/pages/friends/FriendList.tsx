import { useGetFriends } from "./hooks/friendHooks";

export const FriendList = () => {
  const { data: friends } = useGetFriends();

  return (
    <div>
      <ul>
        {friends?.map((friend) => (
          <li key={friend.id}>{friend.alias}</li>
        ))}
      </ul>
    </div>
  );
};
