import { useState } from "react";
import { useGetCurrentUser } from "../../utils/AuthenticationAtoms";
import {
  useFirebaseSignInWithGitHub,
  useFirebaseSignInWithGoogle,
  useFirebseSignUp,
  useSignOut,
} from "../../utils/AuthServiceHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

type AuthPageType = "signUp" | "signIn" | "resetPassword";

export const AuthPage = () => {
  const currentUser = useGetCurrentUser();
  const [currentPage, setCurrentPage] = useState<AuthPageType>("signUp");
  const signUp = useFirebseSignUp();
  const signInWithGoogle = useFirebaseSignInWithGoogle();
  const signInWithGithub = useFirebaseSignInWithGitHub();
  const signOut = useSignOut();

  const handleSignUp = async (email: string, password: string) => {
    await signUp(email, password);
  };

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

          <div className="space-y-3">
            <button
              disabled
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Password
            </button>
            <button
              onClick={signOut}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold py-2 px-4 rounded-lg transition active:bg-blue-800 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Page
  if (currentPage === "signUp") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>

          <form
            className="space-y-4 mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              handleSignUp(email, password);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold py-2 px-4 rounded-lg transition active:bg-blue-800 cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 font-semibold py-2 px-4 rounded-lg transition active:bg-gray-100 cursor-pointer"
            >
              <FontAwesomeIcon icon={faGoogle} className="px-2" />
              Sign up with Google
            </button>
            <button
              onClick={() => signInWithGithub()}
              className="w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-white font-semibold py-2 px-4 rounded-lg transition active:bg-black cursor-pointer"
            >
              {" "}
              <FontAwesomeIcon icon={faGithub} className="px-2" />
              Sign up with GitHub
            </button>
          </div>

          <button
            onClick={() => setCurrentPage("signIn")}
            className="w-full text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-semibold py-2 transition active:text-blue-800 cursor-pointer"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    );
  }

  // Sign In Page
  if (currentPage === "signIn") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

          <form className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold py-2 px-4 rounded-lg transition active:bg-blue-800 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 font-semibold py-2 px-4 rounded-lg transition active:bg-gray-100 cursor-pointer"
            >
              <FontAwesomeIcon icon={faGoogle} className="px-2" />
              Sign in with Google
            </button>
            <button
              onClick={() => signInWithGithub()}
              className="w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-white font-semibold py-2 px-4 rounded-lg transition active:bg-black cursor-pointer"
            >
              <FontAwesomeIcon icon={faGithub} className="px-2" />
              Sign in with GitHub
            </button>
          </div>

          <button
            onClick={() => setCurrentPage("signUp")}
            className="w-full text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-semibold py-2 transition active:text-blue-800 cursor-pointer"
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    );
  }
};
