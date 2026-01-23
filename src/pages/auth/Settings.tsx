import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
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
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../../utils/AuthenticationAtoms";
import { useSignOut, useUpdateDisplayName } from "../../utils/AuthServiceHooks";

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
  const [showEditDisplayName, setShowEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const handleUpdateDisplayName = () => {
    setShowEditDisplayName(false);
    updateDisplayName(displayName);
  };
  const { mutateAsync: updateDisplayName } = useUpdateDisplayName();
  return (
    <>
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      <h2 className="text-xl font-semibold">
        <FontAwesomeIcon icon={faUser} /> {t("settings.accountInfo")}
      </h2>
      {currentUser.photoURL && (
        <img
          src={currentUser.photoURL}
          alt={t("settings.profilePicture")}
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-800">
        {showEditDisplayName ? (
          <input
            className="w-full border border-gray-300 rounded p-2"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        ) : (
          currentUser.displayName || "User"
        )}
      </h3>
      <SecondaryButton
        onClick={() => setShowEditDisplayName(!showEditDisplayName)}
      >
        {showEditDisplayName ? (
          t("settings.displayName.cancel")
        ) : (
          <>
            <FontAwesomeIcon className="mr-2" icon={faEdit} />
            {t("settings.displayName.edit")}
          </>
        )}
      </SecondaryButton>
      {showEditDisplayName && (
        <PrimaryButton onClick={handleUpdateDisplayName}>
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
