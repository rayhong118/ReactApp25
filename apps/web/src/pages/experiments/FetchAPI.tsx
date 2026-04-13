import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";

const FetchAPILab = () => {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((rData) => setData(rData));
  }, []);

  return (
    <ErrorBoundary>
      <div>Whatever {data}</div>
    </ErrorBoundary>
  );
};
export default FetchAPILab;
