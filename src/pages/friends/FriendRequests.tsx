import { Timestamp } from "firebase/firestore";
import type { IFriendRequest } from "./Friend.types";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";

export const FriendRequests = () => {
  return (
    <div>
      <FriendRequest
        request={{
          id: "1",
          type: "received",
          senderId: "1",
          senderAlias: "John",
          senderAvatar: "https://i.pravatar.cc/150?img=12",
          receiverId: "2",
          receiverAlias: "Jane",
          receiverAvatar: "https://i.pravatar.cc/150?img=13",
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
    <div className="flex w-full max-w-md items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <img
          className="w-10 h-10 rounded-full"
          src={request.senderAvatar}
          alt=""
        />
        {request.type === "sent" ? request.receiverAlias : request.senderAlias}
      </div>
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
