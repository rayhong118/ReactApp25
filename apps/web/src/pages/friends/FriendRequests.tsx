import type { IFriendRequest } from "./Friend.types";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FriendCard } from "./FriendCard";
import {
  useGetFriendRequests,
  useAcceptFriendRequest,
  useDeleteFriendRequest,
} from "./hooks/friendRequestHooks";
import { Loading } from "@/components/Loading";
import { useTranslation } from "react-i18next";

export const FriendRequests = () => {
  const { data: requestData, isLoading } = useGetFriendRequests();
  const { t } = useTranslation();

  if (isLoading) {
    return <Loading />;
  }

  const received = requestData?.receivedRequests || [];
  const sent = requestData?.sentRequests || [];

  if (received.length === 0 && sent.length === 0) {
    return (
      <div className="my-8 text-center text-gray-500">
        {t("friends.requests.empty")}
      </div>
    );
  }

  return (
    <div className="my-4 flex flex-col gap-6">
      {received.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t("friends.requests.received", { count: received.length })}
          </h2>
          <div className="flex flex-col gap-2">
            {received.map((req) => (
              <FriendRequestCard key={req.id} request={req} />
            ))}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t("friends.requests.sent", { count: sent.length })}
          </h2>
          <div className="flex flex-col gap-2">
            {sent.map((req) => (
              <FriendRequestCard key={req.id} request={req} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FriendRequestCard = ({ request }: { request: IFriendRequest }) => {
  const { t } = useTranslation();
  const { mutate: acceptRequest, isPending: isAccepting } =
    useAcceptFriendRequest();
  const { mutate: deleteRequest, isPending: isDeleting } =
    useDeleteFriendRequest();

  const isWorking = isAccepting || isDeleting;

  return (
    <div
      className={
        "flex w-full max-w-md items-center justify-between gap-2 p-2 " +
        "rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      }
    >
      <FriendCard
        friend={
          request.type === "sent"
            ? {
                id: request.receiverId,
                alias: request.receiverAlias,
                color: request.receiverColor,
              }
            : {
                id: request.senderId,
                alias: request.senderAlias,
                color: request.senderColor,
              }
        }
      />
      <div className="flex items-center gap-2">
        {request.type === "sent" ? (
          <SecondaryButton
            disabled={isWorking}
            onClick={() => deleteRequest(request.id)}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <FontAwesomeIcon className="md:me-2" icon={faCancel} />
            <span className="hidden md:inline">{t("friends.requests.cancel")}</span>
          </SecondaryButton>
        ) : (
          <>
            <PrimaryButton
              disabled={isWorking}
              onClick={() => acceptRequest(request.id)}
            >
              <FontAwesomeIcon className="md:me-2" icon={faCheck} />
              <span className="hidden md:inline">{t("friends.requests.accept")}</span>
            </PrimaryButton>
            <SecondaryButton
              disabled={isWorking}
              onClick={() => deleteRequest(request.id)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              <FontAwesomeIcon className="md:me-2" icon={faCancel} />
              <span className="hidden md:inline">{t("friends.requests.decline")}</span>
            </SecondaryButton>
          </>
        )}
      </div>
    </div>
  );
};
