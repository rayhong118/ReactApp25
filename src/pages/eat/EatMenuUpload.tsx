// handles menu upload

import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IRestaurant } from "./Eat.types";
import { useSubmitMenuURL, useUploadMenuImage } from "./hooks/menuHooks";

interface IEatMenuUploadProps {
  restaurant: IRestaurant;
}
type TUploadType = "none" | "url" | "image";
export const EatMenuUpload = ({ restaurant }: IEatMenuUploadProps) => {
  const [uploadType, setUploadType] = useState<TUploadType>("none");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <SecondaryButton onClick={() => setUploadType("image")}>
          {t("eat.menu.submitMenuImage")}
        </SecondaryButton>
        <SecondaryButton onClick={() => setUploadType("url")}>
          {t("eat.menu.submitMenuUrl")}
        </SecondaryButton>
      </div>

      {uploadType === "image" && <ImageUpload restaurant={restaurant} />}
      {uploadType === "url" && <UrlUpload restaurant={restaurant} />}
      {uploadType !== "none" && (
        <SecondaryButton onClick={() => setUploadType("none")}>
          {t("eat.menu.cancel")}
        </SecondaryButton>
      )}
    </div>
  );
};

const ImageUpload = ({ restaurant }: { restaurant: IRestaurant }) => {
  const [menuImage, setMenuImage] = useState<File>();
  const { mutateAsync: uploadMenuImage, isPending } = useUploadMenuImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuImage || !restaurant.id) return;

    uploadMenuImage({
      file: menuImage,
      restaurantId: restaurant.id,
    });
  };

  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {isPending && <Loading />}
      {menuImage && (
        <div className="flex justify-center h-[60vh]">
          <img
            src={URL.createObjectURL(menuImage)}
            alt="Menu"
            className="w-auto object-contain rounded-lg shadow-sm"
          />
        </div>
      )}

      <form onSubmit={handleUploadImage} className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setMenuImage(e.target.files?.[0])}
          accept="image/*"
          className="hidden"
        />
        <PrimaryButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("eat.menu.selectImage")}
        </PrimaryButton>
        {menuImage && (
          <PrimaryButton type="submit" disabled={isPending || !menuImage}>
            {t("eat.menu.submit")}
          </PrimaryButton>
        )}
      </form>
    </div>
  );
};

const UrlUpload = ({ restaurant }: { restaurant: IRestaurant }) => {
  const { t } = useTranslation();
  const [menuUrl, setMenuUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  const { mutateAsync: submitMenuUrl, isPending } = useSubmitMenuURL();

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMenuUrl(value);
    setIsValid(validateUrl(value));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validateUrl(menuUrl)) return;
          submitMenuUrl({
            url: menuUrl,
            restaurantId: restaurant.id!,
          });
          setMenuUrl("");
        }}
        className="flex flex-col gap-4"
      >
        <div className="labeled-input">
          <input
            type="url"
            id="menuUrl"
            placeholder=""
            value={menuUrl}
            onChange={handleUrlChange}
            className={!isValid ? "border-red-500" : ""}
          />
          <label htmlFor="menuUrl">{t("eat.menu.submitMenuUrl")}</label>
          {!isValid && (
            <span className="text-red-500 text-xs mt-1">
              Please enter a valid URL
            </span>
          )}
        </div>
        <PrimaryButton
          type="submit"
          disabled={isPending || !menuUrl || !isValid}
        >
          {t("eat.menu.submit")}
        </PrimaryButton>
      </form>
    </div>
  );
};
