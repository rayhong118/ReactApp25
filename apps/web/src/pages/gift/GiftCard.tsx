import { CustomizedButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import {
  faEdit,
  faSquareCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IGift } from "./Gift.types";
import GiftForm from "./GiftForm";
import { useDeleteGift, useUpdateGift } from "./hooks/giftHooks";
import "./Gift.scss";

interface IGiftCardProps {
  gift: IGift;
}

const GiftCard = ({ gift }: IGiftCardProps) => {
  const { t, i18n } = useTranslation();
  const currentUser = useGetCurrentUser();
  const giftCardClass =
    gift.type === "preferred" ? "preferred-gift-card" : "avoid-gift-card";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteGift } = useDeleteGift(currentUser!.uid);
  const { updateGift } = useUpdateGift(currentUser!.uid);

  const handleFulfillGift = () => {
    updateGift({
      ...gift,
      isFulfilled: true,
      fulfilledAt: Timestamp.fromDate(new Date()),
    });
  };
  const handleDeleteGift = async () => {
    await deleteGift(gift.id!);
    setDeleteDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        customizedClassName="max-w-sm"
      >
        <GiftForm gift={gift} closeDialog={() => setDialogOpen(false)} />
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        customizedClassName="max-w-sm"
        actions={[
          {
            label: "Yes",
            onClick: handleDeleteGift,
          },
          {
            label: "No",
            onClick: () => {
              setDeleteDialogOpen(false);
            },
          },
        ]}
      >
        <p className="text-foreground">
          Are you sure you want to delete this gift?
        </p>
      </Dialog>
      <div className={giftCardClass}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{gift.name}</h2>
          {gift.isFulfilled && (
            <div className="flex items-center">
              <FontAwesomeIcon
                className="mr-2 text-green-500"
                icon={faSquareCheck}
              />
              <span className="text-foreground font-semibold">
                {gift.fulfilledAt?.toDate().toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
        <p className="text-foreground">{gift.description}</p>
        {gift.addedAt && (
          <div>
            {gift.addedAt.toDate().toLocaleDateString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}
        <div className="flex gap-2">
          <CustomizedButton
            onClick={() => setDialogOpen(true)}
            className="border-gray-500 border-2 text-foreground font-semibold hover:bg-foreground/20 cursor-pointer"
          >
            <FontAwesomeIcon icon={faEdit} /> {t("gift.edit")}
          </CustomizedButton>
          <CustomizedButton
            onClick={() => setDeleteDialogOpen(true)}
            className="border-gray-500 border-2 text-foreground font-semibold hover:bg-foreground/20 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} /> {t("gift.delete")}
          </CustomizedButton>
          {!gift.isFulfilled && gift.type === "preferred" && (
            <CustomizedButton
              onClick={() => handleFulfillGift()}
              className="border-gray-500 border-2 text-foreground font-semibold hover:bg-foreground/20 cursor-pointer"
            >
              <FontAwesomeIcon icon={faSquareCheck} /> {t("gift.fulfill")}
            </CustomizedButton>
          )}
        </div>
      </div>
    </>
  );
};

export default GiftCard;
