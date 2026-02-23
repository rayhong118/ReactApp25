import { useSearchParams } from "react-router-dom";

/**
 * Hook to determine if the Eat page is in test mode.
 * Test mode is enabled by passing `testMode=true` in the URL search parameters.
 * @returns boolean indicating if test mode is active.
 */
export const useEatTestMode = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("testMode") === "true";
};
