import { PrimaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/pages/auth/AuthenticationAtoms";
import { useGetUserInfo } from "@/utils/UserHooks";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Gift.scss";
import { type IGift } from "./Gift.types";
import { useTranslation } from "react-i18next";
import GiftCard from "./GiftCard";
import GiftForm from "./GiftForm";
import { useGetGiftList } from "./hooks/giftHooks";

const GiftPage = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Partial<IGift>>();

  const [searchParams] = useSearchParams();
  const currentUser = useGetCurrentUser();
  const searchParamUserId = searchParams.get("id");
  const currentUserId = searchParamUserId || currentUser?.uid;

  const { data: giftData } = useGetGiftList(currentUserId!);

  const { data: userInfo } = useGetUserInfo(searchParamUserId || "");

  const preferredGifts = giftData?.filter((gift) => gift.type === "preferred");
  const avoidGifts = giftData?.filter((gift) => gift.type === "avoid");

  const enableAddButtons: boolean =
    !searchParamUserId || currentUser?.uid === searchParamUserId;

  return (
    <div>
      <Dialog
        open={dialogOpen}
        title={t("gift.addTitle", {
          type: currentGift?.type ? t(`gift.types.${currentGift.type}`) : "",
        })}
        customizedClassName="max-w-sm"
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <GiftForm closeDialog={() => setDialogOpen(false)} gift={currentGift} />
      </Dialog>
      <h1 className="text-2xl font-bold">
        {searchParamUserId && userInfo?.alias
          ? t("gift.titleOfUser", { name: userInfo.alias })
          : t("gift.title")}
      </h1>
      <p>{t("gift.subtitle")}</p>

      <div className="flex justify-between mt-4">
        <h2 className="text-xl font-bold">{t("gift.preferred.title")}</h2>
        {enableAddButtons && (
          <PrimaryButton
            onClick={() => {
              setCurrentGift({ type: "preferred" });
              setDialogOpen(true);
            }}
          >
            {t("gift.preferred.add")}
          </PrimaryButton>
        )}
      </div>

      <p>{t("gift.preferred.subtitle")}</p>
      {preferredGifts && preferredGifts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {preferredGifts.map((gift) => (
            <GiftCard key={gift.id || gift.name} gift={gift} ownerId={currentUserId!} />
          ))}
        </div>
      ) : (
        <div className="preferred-gift-card">{t("gift.preferred.empty")}</div>
      )}
      <hr className="my-4" />
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{t("gift.avoid.title")}</h2>
        {enableAddButtons && (
          <PrimaryButton
            onClick={() => {
              setCurrentGift({ type: "avoid" });
              setDialogOpen(true);
            }}
          >
            {t("gift.avoid.add")}
          </PrimaryButton>
        )}
      </div>
      <p>{t("gift.avoid.subtitle")}</p>
      {avoidGifts && avoidGifts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {avoidGifts.map((gift) => (
            <GiftCard key={gift.id || gift.name} gift={gift} ownerId={currentUserId!} />
          ))}
        </div>
      ) : (
        <div className="avoid-gift-card">{t("gift.avoid.empty")}</div>
      )}
    </div>
  );
};

export default GiftPage;
