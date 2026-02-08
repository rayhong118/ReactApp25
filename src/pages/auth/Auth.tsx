import { CustomizedButton } from "@/components/Buttons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useFirebaseSignInWithGitHub,
  useFirebaseSignInWithGoogle,
} from "./AuthServiceHooks";
import { useTranslation } from "react-i18next";

const AuthPage = () => {
  const signInWithGoogle = useFirebaseSignInWithGoogle();
  const signInWithGithub = useFirebaseSignInWithGitHub();
  const { t } = useTranslation();

  // Sign Up Page

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-20 m-2 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {t("auth.title")}
        </h2>

        <div className="space-y-3 mb-6">
          <CustomizedButton
            onClick={() => signInWithGoogle()}
            className={`w-full bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 font-semibold
              py-2 px-4 rounded-lg transition active:bg-gray-100 cursor-pointer`}
          >
            <FontAwesomeIcon icon={faGoogle} className="px-2" />
            {t("auth.google")}
          </CustomizedButton>
          <CustomizedButton
            onClick={() => signInWithGithub()}
            className={`w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2
              focus:ring-gray-600 focus:ring-offset-2 text-white font-semibold py-2 px-4
              rounded-lg transition active:bg-black cursor-pointer`}
          >
            <FontAwesomeIcon icon={faGithub} className="px-2" />
            {t("auth.github")}
          </CustomizedButton>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
