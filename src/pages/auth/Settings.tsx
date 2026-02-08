import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { ColorPicker } from "@/components/ColorPicker";
import { Dialog } from "@/components/Dialog";
import { useGetUserInfo, useUpdateUserInfo } from "@/utils/UserHooks";
import {
  useSetTheme,
  useThemeValue,
  type TColorTheme,
} from "@/utils/UtilAtoms";
import {
  faEdit,
  faGlobe,
  faMoon,
  faSignOut,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "./AuthenticationAtoms";
import { useDeleteAccount, useSignOut } from "./AuthServiceHooks";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
];

const UserSettings = () => {
  const currentUser = useGetCurrentUser();
  const { t } = useTranslation();
  const signOut = useSignOut();
  return (
    <div className="flex flex-col gap-4 max-w-sm">
      {currentUser && (
        <AccountSettings currentUser={currentUser} signOut={signOut} t={t} />
      )}
      <hr />
      <LanguageSettings />
      <hr />
      <ThemeSettings />
      <hr />
      <DeleteAccount />
    </div>
  );
};

const AccountSettings = ({
  currentUser,
  signOut,
  t,
}: {
  currentUser: User;
  signOut: () => void;
  t: any;
}) => {
  const [showEditUserInfo, setShowEditUserInfo] = useState(false);
  const { data: userInfo } = useGetUserInfo(currentUser.uid);
  const [newAlias, setNewAlias] = useState("");
  const [color, setColor] = useState("#fb923c");

  useEffect(() => {
    if (userInfo) {
      setNewAlias(userInfo.alias || currentUser.displayName || "");
      if (userInfo.color) {
        setColor(userInfo.color);
      }
    }
  }, [userInfo, currentUser.displayName]);

  const handleUpdateUserInfo = () => {
    setShowEditUserInfo(false);
    updateUserInfo({ name: newAlias, color });
  };
  const { mutateAsync: updateUserInfo } = useUpdateUserInfo();
  return (
    <>
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      <h2 className="text-xl font-semibold">
        <FontAwesomeIcon icon={faUser} /> {t("settings.accountInfo")}
      </h2>
      <div className="flex flex-col gap-4 items-center">
        <h3 className="text-lg font-semibold text-foreground w-full flex flex-col gap-4 items-center">
          {showEditUserInfo ? (
            <>
              <ColorPicker color={color} setColor={setColor} />
              <input
                className="w-full border border-foreground rounded p-2"
                type="text"
                name="alias"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
              />
            </>
          ) : (
            <>
              <ColorPicker color={color} setColor={setColor} disabled />
              {currentUser.displayName || userInfo?.alias || "User"}
            </>
          )}
        </h3>
      </div>
      <SecondaryButton onClick={() => setShowEditUserInfo(!showEditUserInfo)}>
        {showEditUserInfo ? (
          t("settings.displayName.cancel")
        ) : (
          <>
            <FontAwesomeIcon className="mr-2" icon={faEdit} />
            {t("settings.displayName.edit")}
          </>
        )}
      </SecondaryButton>
      {showEditUserInfo && (
        <PrimaryButton onClick={handleUpdateUserInfo}>
          {t("settings.displayName.save")}
        </PrimaryButton>
      )}
      <span className="font-semibold">{t("settings.email")}:</span>{" "}
      {currentUser.email}
      <span className="font-semibold">
        {t("settings.emailVerificationStatus")}:
      </span>
      {currentUser.emailVerified
        ? t("settings.emailVerified")
        : t("settings.emailNotVerified")}
      <PrimaryButton onClick={signOut}>
        <FontAwesomeIcon className="mr-2" icon={faSignOut} />
        {t("settings.signOut")}
      </PrimaryButton>
    </>
  );
};

export const LanguageSettings = () => {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        <FontAwesomeIcon icon={faGlobe} /> {t("settings.language")}
      </h2>
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.code} - {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ThemeSettings = () => {
  const { t } = useTranslation();
  const theme = useThemeValue();
  const setTheme = useSetTheme();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        <FontAwesomeIcon icon={faMoon} /> {t("settings.theme.title")}
      </h2>
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={theme}
        onChange={(e) => setTheme(e.target.value as TColorTheme)}
      >
        <option value="light">{t("settings.theme.light")}</option>
        <option value="dark">{t("settings.theme.dark")}</option>
      </select>
    </div>
  );
};

export default UserSettings;

const DeleteAccount = () => {
  const { t } = useTranslation();
  const deleteAccount = useDeleteAccount();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("settings.deleteAccount.title")}
      >
        <p>{t("settings.deleteAccount.warning")}</p>
        <div className="flex flex-row justify-end gap-2">
          <SecondaryButton onClick={() => setOpen(false)}>
            {t("settings.deleteAccount.cancel")}
          </SecondaryButton>
          <SecondaryButton
            onClick={deleteAccount}
            className="hover:bg-red-100 text-red-600 font-bold border-2"
          >
            <FontAwesomeIcon icon={faTrash} />{" "}
            {t("settings.deleteAccount.title")}
          </SecondaryButton>
        </div>
      </Dialog>
      <h2 className="text-xl font-semibold">
        <FontAwesomeIcon icon={faTrash} /> {t("settings.deleteAccount.title")}
      </h2>
      <SecondaryButton
        onClick={() => setOpen(true)}
        className="hover:bg-red-100 text-red-600 font-bold border-2 border-red-600"
      >
        <FontAwesomeIcon icon={faTrash} /> {t("settings.deleteAccount.title")}
      </SecondaryButton>
    </div>
  );
};
