import { CustomizedButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IGift } from "./Gift.types";
import GiftForm from "./GiftForm";
import { useDeleteGift, useUpdateGift } from "./hooks/giftHooks";

interface IGiftCardProps {
  gift: IGift;
}

const GiftCard = ({ gift }: IGiftCardProps) => {
  const { t, i18n } = useTranslation();
  const currentUser = useGetCurrentUser();
  const colorClass =
    gift.type === "preferred"
      ? "bg-amber-50 border-amber-500"
      : "bg-stone-50 border-stone-500";
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
        <p>Are you sure you want to delete this gift?</p>
      </Dialog>
      <div className={`p-4 border rounded ${colorClass}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{gift.name}</h2>
          {gift.isFulfilled && (
            <div className="flex items-center">
              <FontAwesomeIcon
                className="mr-2 text-green-500"
                icon={faSquareCheck}
              />
              <span className="text-gray-600 font-semibold">
                {gift.fulfilledAt?.toDate().toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
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
            onClick={() => setDeleteDialogOpen(true)}
            className="border-gray-500 border-2 text-gray-500 font-semibold hover:bg-gray-50 cursor-pointer"
          >
            {t("gift.delete")}
          </CustomizedButton>
          {!gift.isFulfilled && gift.type === "preferred" && (
            <CustomizedButton
              onClick={() => handleFulfillGift()}
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
