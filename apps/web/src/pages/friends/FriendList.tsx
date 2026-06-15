import { useGetFriends, useDeleteFriend } from "./hooks/friendHooks";
import { FriendCard } from "./FriendCard";
import { Loading } from "@/components/Loading";
import { SecondaryButton } from "@/components/Buttons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const FriendList = () => {
  const { data: friends, isLoading } = useGetFriends();
  const { mutate: deleteFriend, isPending: isDeleting } = useDeleteFriend();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="my-8 text-center text-gray-500">
        {t("friends.list.empty")}
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
          <div className="flex items-center gap-2">
            <SecondaryButton
              onClick={() => navigate(`/gifts?id=${friend.id}`)}
              className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <FontAwesomeIcon icon={faGift} className="mr-1" />
              {t("friends.list.wishlist")}
            </SecondaryButton>
            <SecondaryButton
              disabled={isDeleting}
              onClick={() => {
                if (
                  window.confirm(
                    t("friends.list.removeConfirmation", { name: friend.alias || "this friend" }),
                  )
                ) {
                  deleteFriend(friend.id);
                }
              }}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              {t("friends.list.remove")}
            </SecondaryButton>
          </div>
        </div>
      ))}
    </div>
  );
};
