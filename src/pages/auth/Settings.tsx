import { PrimaryButton } from "@/components/Buttons";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../../utils/AuthenticationAtoms";
import { useSignOut } from "../../utils/AuthServiceHooks";
const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
];

const UserSettings = () => {
  const currentUser = useGetCurrentUser();
  const signOut = useSignOut();

  const { i18n } = useTranslation();

  if (!currentUser) {
    return (
      <div>
        <h1>User Settings</h1>
        <h2>Account Info</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">User Settings</h1>
      <h2 className="text-xl font-semibold">Account Info</h2>
      {currentUser.photoURL && (
        <img
          src={currentUser.photoURL}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-800">
        {currentUser.displayName || "User"}
      </h3>
      <span className="font-semibold">Email:</span> {currentUser.email}
      <span className="font-semibold">Status:</span>
      {currentUser.emailVerified ? "Verified" : "Not Verified"}
      <PrimaryButton onClick={signOut} paddingMultiplier={2}>
        Sign Out
      </PrimaryButton>
      <h2 className="text-xl font-semibold">Language Settings</h2>
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

export default UserSettings;
