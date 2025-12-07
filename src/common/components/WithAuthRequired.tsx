import React from "react";
import { useGetCurrentUser } from "../utils/AuthenticationAtoms";

type WithAuthRequiredProps = {
  component: React.ComponentType<Record<string, never>>;
};

export const WithAuthRequired: React.FC<WithAuthRequiredProps> = ({
  component: Component,
}) => {
  const currentUser = useGetCurrentUser();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-red-50 border border-red-100 text-red-800 rounded-md p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Access denied</h2>
          <p className="text-sm">
            You must be signed in to view this page. Please log in or register
            to continue.
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
};

export default WithAuthRequired;
