import { useState } from "react";
import { type IGift } from "./Gift.types";
import { Dialog } from "@/components/Dialog";
import GiftCard from "./GiftCard";
import { PrimaryButton } from "@/components/Buttons";
import "./Gift.scss";
import GiftForm from "./GiftForm";

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
  const gifts: IGift[] = mockGifts;

  const preferredGifts = gifts.filter((gift) => gift.type === "preferred");
  const avoidGifts = gifts.filter((gift) => gift.type === "avoid");

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={dialogOpen}
        title="Add Gift"
        customizedClassName="max-w-sm"
        onClose={() => setDialogOpen(false)}
      >
        <GiftForm closeDialog={() => setDialogOpen(false)} />
      </Dialog>
      <h1 className="text-2xl font-bold">Gift Page</h1>
      <h2 className="text-xl font-bold">Preffered Gifts</h2>
      <PrimaryButton onClick={() => setDialogOpen(true)}>
        Add Gift
      </PrimaryButton>
      <p>Create a list of gifts you would like to receive</p>
      {preferredGifts.map((gift) => (
        <GiftCard key={gift.name} gift={gift} />
      ))}

      <h2 className="text-xl font-bold">Avoid Gifts</h2>
      <p>Create a list of gifts you would not like to receive</p>
      {avoidGifts.map((gift) => (
        <GiftCard key={gift.name} gift={gift} />
      ))}
    </div>
  );
};

export default GiftPage;
