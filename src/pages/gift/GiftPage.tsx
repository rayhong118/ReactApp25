import { useState } from "react";
import { type IGift } from "./Gift.types";
import { Dialog } from "@/components/Dialog";
import GiftCard from "./GiftCard";
import { PrimaryButton } from "@/components/Buttons";
import "./Gift.scss";
import GiftForm from "./GiftForm";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { useGetGiftList } from "./hooks/GiftHooks";

const mockGifts: IGift[] = [
  {
    name: "Gift 1",
    description: "Description 1",
    type: "preferred",
    addedAt: new Date(),
    isFulfilled: false,
  },
  {
    name: "Gift 2",
    description: "Description 2",
    type: "avoid",
    addedAt: new Date(),
    isFulfilled: false,
  },
];

const GiftPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Partial<IGift>>();

  const [searchParams] = useSearchParams();
  const currentUser = useGetCurrentUser();
  const searchParamUserId = searchParams.get("id");
  const currentUserId = searchParamUserId || currentUser?.uid;

  const { data: giftData } = useGetGiftList(currentUserId!);

  const preferredGifts = giftData?.filter((gift) => gift.type === "preferred");
  const avoidGifts = giftData?.filter((gift) => gift.type === "avoid");

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
        Gift Page of {searchParamUserId && currentUser?.displayName}
      </h1>
      <p>Gifts are items you would like to receive or avoid</p>

      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Preffered Gifts</h2>
        {!searchParamUserId && (
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
        {!searchParamUserId && (
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
