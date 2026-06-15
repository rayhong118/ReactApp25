import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useState } from "react";
import type { IGift } from "./Gift.types";
import { useAddGift } from "./hooks/giftHooks";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useUpdateGift } from "./hooks/giftHooks";
import { useTranslation } from "react-i18next";

interface IGiftFormProps {
  closeDialog: () => void;
  gift?: Partial<IGift>;
}

const GiftForm = (props: IGiftFormProps) => {
  const { closeDialog, gift } = props;
  const { t } = useTranslation();
  const currentUser = useGetCurrentUser();
  const { addGift } = useAddGift(currentUser!.uid);
  const { updateGift } = useUpdateGift(currentUser!.uid);
  const [giftForm, setGiftForm] = useState<Partial<IGift>>({
    name: "",
    description: "",
    ...gift,
  });

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
            id="name"
            type="text"
            placeholder=""
            value={giftForm.name || ""}
            onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
          />
          <label htmlFor="name">{t("gift.form.nameLabel")}</label>
        </div>

        <div className="labeled-input">
          <textarea
            id="description"
            placeholder=""
            value={giftForm.description || ""}
            onChange={(e) =>
              setGiftForm({ ...giftForm, description: e.target.value })
            }
          />
          <label htmlFor="description">{t("gift.form.descriptionLabel")}</label>
        </div>

        {gift?.type === "preferred" && giftForm.isFulfilled === true && (
          <div>
            <input
              id="fulfilled"
              type="checkbox"
              checked={giftForm.isFulfilled || false}
              onChange={(e) =>
                setGiftForm({ ...giftForm, isFulfilled: e.target.checked })
              }
            />
            <label htmlFor="fulfilled">{t("gift.form.fulfilledLabel")}</label>
          </div>
        )}

        <div className="flex justify-end">
          <SecondaryButton onClick={closeDialog}>{t("gift.form.cancel")}</SecondaryButton>
          <PrimaryButton type="submit">{t("gift.form.submit")}</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default GiftForm;
