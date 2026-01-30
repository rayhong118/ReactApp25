import { useGetFriends } from "./hooks/friendHooks";

const Friends = () => {
  const { data: friends } = useGetFriends();
  return (
    <div>
      <h1>Friends</h1>
      <ul>
        {friends?.map((friend) => (
          <li key={friend.id}>{friend.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
