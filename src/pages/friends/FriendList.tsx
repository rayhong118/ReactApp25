import { useGetFriends } from "./hooks/friendHooks";

export const FriendList = () => {
  const { data: friends } = useGetFriends();

  return (
    <div>
      <h1>Friend List</h1>
      <ul>
        {friends?.map((friend) => (
          <li key={friend.id}>{friend.id}</li>
        ))}
      </ul>
    </div>
  );
};
