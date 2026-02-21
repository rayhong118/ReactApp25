import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useState } from "react";
import type { IGift } from "./Gift.types";
import { useAddGift } from "./hooks/giftHooks";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useUpdateGift } from "./hooks/giftHooks";
interface IGiftFormProps {
  closeDialog: () => void;
  gift?: Partial<IGift>;
}

const GiftForm = (props: IGiftFormProps) => {
  const { closeDialog, gift } = props;
  const currentUser = useGetCurrentUser();
  const { addGift } = useAddGift(currentUser!.uid);
  const { updateGift } = useUpdateGift(currentUser!.uid);
  const [giftForm, setGiftForm] = useState<Partial<IGift>>(
    gift || ({} as IGift),
  );

  const handleGiftFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gift?.id) {
      await updateGift(giftForm);
    } else {
      await addGift(giftForm);
    }
    closeDialog();
  };
  return (
    <div>
      <form onSubmit={handleGiftFormSubmit}>
        <div className="labeled-input">
          <input
            type="text"
            placeholder=""
            value={giftForm.name}
            onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
          />
          <label htmlFor="name">Gift Name</label>
        </div>

        <div className="labeled-input">
          <textarea
            placeholder=""
            value={giftForm.description}
            onChange={(e) =>
              setGiftForm({ ...giftForm, description: e.target.value })
            }
          />
          <label htmlFor="description">Gift Description</label>
        </div>

        {gift?.type === "preferred" && giftForm.isFulfilled === true && (
          <div>
            <input
              type="checkbox"
              checked={giftForm.isFulfilled || false}
              onChange={(e) =>
                setGiftForm({ ...giftForm, isFulfilled: e.target.checked })
              }
            />
            <label htmlFor="fulfilled">Fulfilled</label>
          </div>
        )}

        <div className="flex justify-end">
          <SecondaryButton onClick={closeDialog}>Cancel</SecondaryButton>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default GiftForm;
