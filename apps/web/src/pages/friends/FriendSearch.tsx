import { firebaseFunctions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import type { IFriend } from "@shared/types";
import { PrimaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@/components/Dialog";
import React from "react";
import { useCreateFriendRequest, useGetFriendRequests } from "./hooks/friendRequestHooks";
import { useGetFriends } from "./hooks/friendHooks";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useGetUserInfo } from "@/utils/UserHooks";
import { serverTimestamp } from "firebase/firestore";

export const FriendSearch = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FriendSearchDialog open={open} onClose={() => setOpen(false)} />
      <PrimaryButton onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faSearch} />
        <span className="ms-2">Add new friend</span>
      </PrimaryButton>
    </div>
  );
};

const FriendSearchDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const addMessageBars = useAddMessageBars();

  const currentUser = useGetCurrentUser();
  const currentUserId = currentUser?.uid || "";
  const { data: currentUserInfo } = useGetUserInfo(currentUserId);
  const { mutate: createFriendRequest, isPending: isSending } =
    useCreateFriendRequest();
  const { data: friends } = useGetFriends();
  const { data: friendRequests } = useGetFriendRequests();

  const getFriendStatus = (userId: string) => {
    if (userId === currentUserId) return "me";

    const isFriend = friends?.some((f) => f.id === userId);
    if (isFriend) return "friend";

    const hasSentRequest = friendRequests?.sentRequests?.some(
      (req) => req.receiverId === userId && req.status === "pending",
    );
    if (hasSentRequest) return "sent";

    const hasReceivedRequest = friendRequests?.receivedRequests?.some(
      (req) => req.senderId === userId && req.status === "pending",
    );
    if (hasReceivedRequest) return "received";

    return "none";
  };

  useEffect(() => {
    if (!open) {
      setUserInput("");
      setSearchResults([]);
    }
  }, [open]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const getUserViaSearch = httpsCallable(
        firebaseFunctions,
        "getUserViaSearch",
      );
      const result = await getUserViaSearch({ searchTerm: userInput });
      setSearchResults(result.data as IFriend[]);
    } catch (error) {
      console.error("Error searching users:", error);
      addMessageBars([
        {
          id: Date.now().toString(),
          message: "Error searching users. Please try again.",
          type: "error",
          autoDismiss: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUser: IFriend) => {
    if (!currentUser || !currentUserInfo) {
      addMessageBars([
        {
          id: Date.now().toString(),
          message: "Unable to send request: profile still loading.",
          type: "error",
          autoDismiss: true,
        },
      ]);
      return;
    }

    createFriendRequest({
      type: "sent",
      senderId: currentUser.uid,
      senderAlias:
        currentUserInfo.alias || currentUser.displayName || "Unknown",
      senderColor: currentUserInfo.color || "#3b82f6",
      receiverId: targetUser.id,
      receiverAlias: targetUser.alias || "Unknown",
      receiverColor: targetUser.color || "#10b981",
      status: "pending",
      addedAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      customizedClassName="max-w-md w-full"
      title="Add new friend"
    >
      <form onSubmit={handleSearch}>
        <div className="labeled-input flex items-center">
          <input
            type="text"
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder=" "
            className="flex-grow"
          />
          <label htmlFor="userInput">Search for a friend</label>
          <PrimaryButton type="submit" disabled={loading} className="ml-2">
            {loading ? "Searching..." : "Search"}
          </PrimaryButton>
        </div>
      </form>

      <div className="mt-4">
        {searchResults.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchResults.map((user) => (
              <li
                key={user.id}
                className="py-3 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                    style={{ backgroundColor: user.color || "#ccc" }}
                  >
                    {(user.alias || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {user.alias}
                    </div>
                  </div>
                </div>
                {(() => {
                  const status = getFriendStatus(user.id);
                  if (status === "me") {
                    return (
                      <span className="text-sm text-gray-500 font-medium px-3 py-1">
                        You
                      </span>
                    );
                  }
                  if (status === "friend") {
                    return (
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold px-3 py-1">
                        Friend
                      </span>
                    );
                  }
                  if (status === "sent") {
                    return (
                      <span className="text-sm text-gray-500 italic px-3 py-1">
                        Pending request
                      </span>
                    );
                  }
                  if (status === "received") {
                    return (
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium px-3 py-1">
                        Requested you
                      </span>
                    );
                  }
                  return (
                    <PrimaryButton
                      onClick={() => handleSendRequest(user)}
                      disabled={isSending}
                      className="text-sm px-3 py-1"
                    >
                      {isSending ? "Adding..." : "Add"}
                    </PrimaryButton>
                  );
                })()}
              </li>
            ))}
          </ul>
        ) : userInput && !loading ? (
          <p className="text-gray-500 text-center py-4">No users found.</p>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Search for a friend by their exact email address or full alias name (case-insensitive).
          </p>
        )}
      </div>
    </Dialog>
  );
};
