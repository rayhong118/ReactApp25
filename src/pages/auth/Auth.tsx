import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetCurrentUser } from "../../utils/AuthenticationAtoms";
import {
  useFirebaseSignInWithGitHub,
  useFirebaseSignInWithGoogle,
  useSignOut,
} from "../../utils/AuthServiceHooks";

const AuthPage = () => {
  const currentUser = useGetCurrentUser();
  const signInWithGoogle = useFirebaseSignInWithGoogle();
  const signInWithGithub = useFirebaseSignInWithGitHub();
  const signOut = useSignOut();

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
              onClick={signOut}
              className={`w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold py-2 px-4
              rounded-lg transition active:bg-blue-800 cursor-pointer`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Page

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-20 m-2 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sign Up / Sign In
        </h2>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => signInWithGoogle()}
            className={`w-full bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 font-semibold
              py-2 px-4 rounded-lg transition active:bg-gray-100 cursor-pointer`}
          >
            <FontAwesomeIcon icon={faGoogle} className="px-2" />
            Sign up / Sign in with Google
          </button>
          <button
            onClick={() => signInWithGithub()}
            className={`w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2
              focus:ring-gray-600 focus:ring-offset-2 text-white font-semibold py-2 px-4
              rounded-lg transition active:bg-black cursor-pointer`}
          >
            <FontAwesomeIcon icon={faGithub} className="px-2" />
            Sign up / Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
