import { Suspense } from "react";
import { Loading } from "../components/Loading";


export const withSuspense = (component: React.ReactNode) => {
  return (
    <Suspense fallback={<Loading />}>
      {component}
    </Suspense>
  );
};