import type { IGift } from "./Gift.types";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/Dialog";
import { useState } from "react";
import GiftForm from "./GiftForm";
import { CustomizedButton } from "@/components/Buttons";

interface IGiftCardProps {
  gift: IGift;
}

const GiftCard = ({ gift }: IGiftCardProps) => {
  const { t, i18n } = useTranslation();
  const colorClass =
    gift.type === "preferred"
      ? "bg-amber-50 border-amber-500"
      : "bg-stone-50 border-stone-500";
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <GiftForm gift={gift} closeDialog={() => setDialogOpen(false)} />
      </Dialog>
      <div className={`p-4 border rounded ${colorClass}`}>
        <h2 className="text-lg font-bold">{gift.name}</h2>
        <p className="text-gray-600">{gift.description}</p>
        {gift.addedAt && (
          <div>
            {gift.addedAt.toDate().toLocaleDateString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}
        <div>
          <CustomizedButton
            onClick={() => setDialogOpen(true)}
            className="border-gray-500 border-2 text-gray-500 font-semibold hover:bg-gray-50 cursor-pointer"
          >
            {t("gift.edit")}
          </CustomizedButton>
          <CustomizedButton
            onClick={() => setDialogOpen(true)}
            className="border-gray-500 border-2 text-gray-500 font-semibold hover:bg-gray-50 cursor-pointer"
          >
            {t("gift.delete")}
          </CustomizedButton>
          {!gift.isFulfilled && gift.type === "preferred" && (
            <CustomizedButton
              onClick={() => setDialogOpen(true)}
              className="border-gray-500 border-2 text-gray-500 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {t("gift.fulfill")}
            </CustomizedButton>
          )}
        </div>
      </div>
    </>
  );
};

export default GiftCard;
