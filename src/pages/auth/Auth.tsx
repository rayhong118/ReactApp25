import { useState } from "react";
import { useGetCurrentUser } from "../../common/utils/AuthenticationAtoms";
import {
  useFirebaseSignInWithGitHub,
  useFirebaseSignInWithGoogle,
} from "../../common/utils/AuthServiceHooks";

type AuthPageType = "signUp" | "signIn" | "resetPassword";

export const AuthPage = () => {
  const currentUser = useGetCurrentUser();
  const [currentPage, setCurrentPage] = useState<AuthPageType>("signUp");
  const signInWithGoogle = useFirebaseSignInWithGoogle();
  const signInWithGithub = useFirebaseSignInWithGitHub();

  // If current user is logged in
  if (currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Account Info
          </h2>

          <div className="flex flex-col items-center mb-6">
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
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.emailVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentUser.emailVerified
                  ? "Email Verified"
                  : "Email Not Verified"}
              </span>
            </p>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Reset Password
          </button>
        </div>
      </div>
    );
  }
  if (currentPage === "signUp") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Auth Page
        <div>Sign Up with email and password</div>
        <div>Sign Up with third party accounts</div>
        <button
          onClick={() => setCurrentPage("signIn")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Go to Sign In
        </button>
      </div>
    );
  }
  if (currentPage === "signIn") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Auth Page
        <div>Sign In with email and password</div>
        <div>Sign In with third party accounts</div>
        <button
          onClick={() => setCurrentPage("signUp")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Go to Sign Up
        </button>
        <button
          onClick={() => signInWithGoogle()}
          className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signInWithGithub()}
          className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }
};
