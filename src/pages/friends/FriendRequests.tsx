import { Timestamp } from "firebase/firestore";
import type { IFriendRequest } from "./Friend.types";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FriendCard } from "./FriendCard";

export const FriendRequests = () => {
  return (
    <div>
      <FriendRequest
        request={{
          id: "1",
          type: "received",
          senderId: "1",
          senderAlias: "John",
          senderColor: "#ff0000",
          receiverId: "2",
          receiverAlias: "Jane",
          receiverColor: "#00ff00",
          status: "pending",
          addedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }}
      />
    </div>
  );
};

const FriendRequest = ({ request }: { request: IFriendRequest }) => {
  return (
    <div className="flex w-full max-w-md items-center justify-between gap-2 my-2">
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
          <SecondaryButton>
            <FontAwesomeIcon className="md:me-2" icon={faCancel} />
            <span className="hidden md:inline">Cancel</span>
          </SecondaryButton>
        ) : (
          <>
            <PrimaryButton>
              <FontAwesomeIcon className="md:me-2" icon={faCheck} />
              <span className="hidden md:inline">Accept</span>
            </PrimaryButton>
            <SecondaryButton>
              <FontAwesomeIcon className="md:me-2" icon={faCancel} />
              <span className="hidden md:inline">Decline</span>
            </SecondaryButton>
          </>
        )}
      </div>
    </div>
  );
};
