import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";

const FetchAPILab = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const abortController = new AbortController();
    fetch("https://rickandmortyapi.com/api/character", {
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((rData) => setData(rData))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Fetch error: ", err);
        }
      });
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div>Whatever {data}</div>
    </ErrorBoundary>
  );
};
export default FetchAPILab;

export const HandleSSE = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource("someURL");

    const handleEvent = (event: MessageEvent) => {
      try {
        const eventData = JSON.parse(event.data);
        setData(eventData);
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    };

    // 1. Use addEventListener instead of non-existent addEventHandler
    eventSource.addEventListener("eventName", handleEvent);

    // 2. Clean up event listener and close the EventSource connection
    return () => {
      eventSource.removeEventListener("eventName", handleEvent);
      eventSource.close();
    };
  }, []);

  return <div>SSE Data: {JSON.stringify(data)}</div>;
};
