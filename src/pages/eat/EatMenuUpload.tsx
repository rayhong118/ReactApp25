// handles menu upload

import {
  CustomizedButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IRestaurant } from "./Eat.types";
import { useSubmitMenuURL, useUploadMenuImage } from "./hooks/menuHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faImage, faLink } from "@fortawesome/free-solid-svg-icons";

interface IEatMenuUploadProps {
  restaurant: IRestaurant;
}
type TUploadType = "none" | "url" | "image";
export const EatMenuUpload = ({ restaurant }: IEatMenuUploadProps) => {
  const [uploadType, setUploadType] = useState<TUploadType>("none");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap justify-start align-start">
        <SecondaryButton onClick={() => setUploadType("image")}>
          <FontAwesomeIcon icon={faImage} /> {t("eat.menu.submitMenuImage")}
        </SecondaryButton>
        <SecondaryButton onClick={() => setUploadType("url")} disabled={true}>
          <FontAwesomeIcon icon={faLink} /> {t("eat.menu.submitMenuUrl")}(
          {t("eat.menu.avoidUsing")})
        </SecondaryButton>
      </div>

      {uploadType === "image" && <ImageUpload restaurant={restaurant} />}
      {uploadType === "url" && <UrlUpload restaurant={restaurant} />}
      {uploadType !== "none" && (
        <SecondaryButton onClick={() => setUploadType("none")}>
          <FontAwesomeIcon icon={faXmark} /> {t("eat.menu.cancel")}
        </SecondaryButton>
      )}
    </div>
  );
};

// const MAX_IMAGE_COUNT = 4;
const ImageUpload = ({ restaurant }: { restaurant: IRestaurant }) => {
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const { mutateAsync: uploadMenuImage, isPending } = useUploadMenuImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuImages || !restaurant.id) return;

    uploadMenuImage({
      files: menuImages,
      restaurantId: restaurant.id,
    });
    setMenuImages([]);
  };

  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {isPending && <Loading />}
      {menuImages && (
        <ImagePreviews menuImages={menuImages} setMenuImages={setMenuImages} />
      )}

      <form onSubmit={handleUploadImage} className="flex flex-col gap-2">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) =>
            setMenuImages((prev) => [...prev, ...(e.target.files || [])])
          }
          accept="image/*"
          className="hidden"
        />
        <PrimaryButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("eat.menu.selectImage")}
        </PrimaryButton>
        {menuImages && menuImages.length > 0 && (
          <PrimaryButton type="submit" disabled={isPending || !menuImages}>
            {t("eat.menu.submit")}
          </PrimaryButton>
        )}
      </form>
    </div>
  );
};

const ImagePreviews = ({
  menuImages,
  setMenuImages,
}: {
  menuImages: File[];
  setMenuImages: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  return (
    <div className={`flex flex-wrap justify-center w-full`}>
      {menuImages.map((menuImage, index) => (
        <div
          key={menuImage.name}
          className="flex-1 flex justify-center items-center relative max-w-1/2"
        >
          <img
            src={URL.createObjectURL(menuImage)}
            alt="Menu"
            className="w-auto object-contain rounded-lg shadow-sm"
          />
          <CustomizedButton
            onClick={() =>
              setMenuImages((prev: File[]) =>
                prev.filter((_: File, i: number) => i !== index),
              )
            }
            className="absolute top-0 right-0 bg-background/50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </CustomizedButton>
        </div>
      ))}
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

  if (isPending) return <Loading />;

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
        <PrimaryButton type="submit" disabled={!menuUrl || !isValid}>
          {t("eat.menu.submit")}
        </PrimaryButton>
      </form>
    </div>
  );
};
