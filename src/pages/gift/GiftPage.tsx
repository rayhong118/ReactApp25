import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Gift.scss";
import { type IGift } from "./Gift.types";
import GiftCard from "./GiftCard";
import GiftForm from "./GiftForm";
import { useGetGiftList } from "./hooks/GiftHooks";
import { useGetDisplayName } from "@/utils/AuthServiceHooks";

const GiftPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Partial<IGift>>();

  const [searchParams] = useSearchParams();
  const currentUser = useGetCurrentUser();
  const searchParamUserId = searchParams.get("id");
  const currentUserId = searchParamUserId || currentUser?.uid;

  const { data: giftData } = useGetGiftList(currentUserId!);
  const { data: displayName } = useGetDisplayName(searchParamUserId || "");

  const preferredGifts = giftData?.filter((gift) => gift.type === "preferred");
  const avoidGifts = giftData?.filter((gift) => gift.type === "avoid");

  const enableAddButtons: boolean =
    !searchParamUserId || currentUser?.uid === searchParamUserId;

  return (
    <div>
      <Dialog
        open={dialogOpen}
        title={`Add ${currentGift?.type} gift`}
        customizedClassName="max-w-sm"
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <GiftForm closeDialog={() => setDialogOpen(false)} gift={currentGift} />
      </Dialog>
      <h1 className="text-2xl font-bold">
        Gift Page {searchParamUserId && displayName}
      </h1>
      <p>Gifts are items you would like to receive or avoid</p>

      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Preffered Gifts</h2>
        {enableAddButtons && (
          <PrimaryButton
            onClick={() => {
              setCurrentGift({ type: "preferred" });
              setDialogOpen(true);
            }}
          >
            Add Preferred Gift
          </PrimaryButton>
        )}
      </div>

      <p>Create a list of gifts you would like to receive</p>
      {preferredGifts && preferredGifts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {preferredGifts.map((gift) => (
            <GiftCard key={gift.name} gift={gift} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-amber-50 border-amber-500 p-2 rounded border text-lg font-semibold">
          No preferred gifts found
        </div>
      )}
      <hr className="my-4" />
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Avoid Gifts</h2>
        {enableAddButtons && (
          <PrimaryButton
            onClick={() => {
              setCurrentGift({ type: "avoid" });
              setDialogOpen(true);
            }}
          >
            Add Avoid Gift
          </PrimaryButton>
        )}
      </div>
      <p>Create a list of gifts you would not like to receive</p>
      {avoidGifts && avoidGifts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {avoidGifts.map((gift) => (
            <GiftCard key={gift.name} gift={gift} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-stone-50 border-stone-500 p-2 rounded border text-lg font-semibold">
          No avoid gifts found
        </div>
      )}
    </div>
  );
};

export default GiftPage;
