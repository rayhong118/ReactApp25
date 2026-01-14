import React from "react";
import { useGetCurrentUser } from "../utils/AuthenticationAtoms";
import { useNavigate } from "react-router-dom";
import { CustomizedButton } from "./Buttons";
import { useTranslation } from "react-i18next";

type WithAuthRequiredProps = {
  component: React.ComponentType<Record<string, never>>;
};

export const WithAuthRequired: React.FC<WithAuthRequiredProps> = ({
  component: Component,
}) => {
  const currentUser = useGetCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div
          className="max-w-lg w-full bg-red-50 border border-red-100 text-red-800 
          rounded-md p-6 text-center"
        >
          <h2 className="text-lg font-semibold mb-2">
            {t("auth.withAuthRequired.accessDenied")}
          </h2>
          <p className="text-sm">
            {t("auth.withAuthRequired.youMustBeSignedIn")}
          </p>
          <hr className="my-4" />
          <CustomizedButton
            className="border-1 "
            onClick={() => navigate("/auth")}
          >
            {t("auth.withAuthRequired.signIn")}
          </CustomizedButton>
        </div>
      </div>
    );
  }

  return <Component />;
};

export default WithAuthRequired;
