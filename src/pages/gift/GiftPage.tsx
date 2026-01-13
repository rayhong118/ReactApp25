import { useState } from "react";
import { type IGift } from "./Gift.types";
import { Dialog } from "@/components/Dialog";
import GiftCard from "./GiftCard";

const GiftPage = () => {
  const gifts: IGift[] = [];

  const preferredGifts = gifts.filter((gift) => gift.type === "preferred");
  const avoidGifts = gifts.filter((gift) => gift.type === "avoid");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [giftForm, setGiftForm] = useState<IGift>({
    name: "",
    description: "",
  } as IGift);

  const handleGiftFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogOpen(false);
    setGiftForm({} as IGift);
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        actions={[
          {
            label: "Close",
            onClick: () => setDialogOpen(false),
          },
        ]}
      >
        <form onSubmit={handleGiftFormSubmit}>
          <input
            type="text"
            placeholder="Enter a gift"
            value={giftForm.name}
            onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter a description"
            value={giftForm.description}
            onChange={(e) =>
              setGiftForm({ ...giftForm, description: e.target.value })
            }
          />
          <button>Add Gift</button>
        </form>
      </Dialog>
      <h1>Gift Page</h1>
      <h2>Preffered Gifts</h2>
      <p>Create a list of gifts you would like to receive</p>
      {preferredGifts.map((gift) => (
        <GiftCard key={gift.name} gift={gift} />
      ))}

      <h2>Avoid Gifts</h2>
      <p>Create a list of gifts you would not like to receive</p>
      {avoidGifts.map((gift) => (
        <GiftCard key={gift.name} gift={gift} />
      ))}
    </div>
  );
};

export default GiftPage;
