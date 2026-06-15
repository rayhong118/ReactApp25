import { useGetFriends, useDeleteFriend } from "./hooks/friendHooks";
import { FriendCard } from "./FriendCard";
import { Loading } from "@/components/Loading";
import { SecondaryButton } from "@/components/Buttons";

export const FriendList = () => {
  const { data: friends, isLoading } = useGetFriends();
  const { mutate: deleteFriend, isPending: isDeleting } = useDeleteFriend();

  if (isLoading) {
    return <Loading />;
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="my-8 text-center text-gray-500">
        You haven't added any friends yet.
      </div>
    );
  }

  return (
    <div className="my-4 flex flex-col gap-3">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex w-full max-w-md items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FriendCard friend={friend} />
          <SecondaryButton
            disabled={isDeleting}
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to remove ${friend.alias || "this friend"}?`,
                )
              ) {
                deleteFriend(friend.id);
              }
            }}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            Remove
          </SecondaryButton>
        </div>
      ))}
    </div>
  );
};
