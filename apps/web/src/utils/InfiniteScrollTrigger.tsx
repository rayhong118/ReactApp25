import { Loading } from "@/components/Loading";
import { useEffect, useRef } from "react";

const InfiniteScrollTrigger = ({
  onIntersect,
  hasMore,
  isLoading,
}: {
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
}) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onIntersect, hasMore, isLoading]);

  return (
    <div ref={observerTarget} style={{ height: "20px", margin: "10px 0" }}>
      {isLoading && <Loading />}
    </div>
  );
};

export default InfiniteScrollTrigger;
