import { CustomizedButton } from "@/components/Buttons";
import { useGetCurrentUser } from "../../utils/AuthenticationAtoms";
import { useSignOut } from "../../utils/AuthServiceHooks";
import { useTranslation } from "react-i18next";

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
    <div>
      <h1>User Settings</h1>
      <h2>Account Info</h2>
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
      <CustomizedButton onClick={signOut} paddingMultiplier={2}>
        Sign Out
      </CustomizedButton>
      <h2>Language</h2>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};

export default UserSettings;
