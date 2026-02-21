import { Suspense } from "react";
import { Loading } from "../components/Loading";

export const withSuspense = (component: React.ReactNode) => {
  return (
    <Suspense fallback={<Loading fullHeight={true} />}>{component}</Suspense>
  );
};

export const withComponentSuspense = (component: React.ReactNode) => {
  return (
    <Suspense fallback={<Loading fullHeight={false} />}>{component}</Suspense>
  );
};

export const withBlankSuspense = (component: React.ReactNode) => {
  return <Suspense fallback={<></>}>{component}</Suspense>;
};
