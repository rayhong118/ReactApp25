import { firebaseFunctions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";
import type { IFriend } from "./Friend.types";
import { PrimaryButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@/components/Dialog";
import React from "react";

export const FriendSearch = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FriendSearchDialog open={open} onClose={() => setOpen(false)} />
      <PrimaryButton onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faSearch} />
        Add new friend
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

  const handleSendRequest = async (_userIdToRequest: string) => {
    // Placeholder for sending friend request logic
    console.log("Sending friend request to:", _userIdToRequest);
    addMessageBars([
      {
        id: Date.now().toString(),
        message: "Friend request functionality is being implemented.",
        type: "success",
        autoDismiss: true,
      },
    ]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      customizedClassName="max-w-md w-full"
      title="Add new friend"
    >
      <form onSubmit={handleSearch}>
        <div className="labeled-input">
          <input
            type="text"
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder=" "
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
                <PrimaryButton
                  onClick={() => handleSendRequest(user.id)}
                  className="text-sm px-3 py-1"
                >
                  Add
                </PrimaryButton>
              </li>
            ))}
          </ul>
        ) : userInput && !loading ? (
          <p className="text-gray-500 text-center py-4">No users found.</p>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Search for a friend by their name. Partial prefix matches work
            (e.g., search "ray" for "Rayhong").
          </p>
        )}
      </div>
    </Dialog>
  );
};
