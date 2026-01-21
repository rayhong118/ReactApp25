import "./loading.css";

export const Loading = ({ fullHeight }: { fullHeight?: boolean }) => {
  return (
    <div
      className={
        fullHeight
          ? "flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] w-full"
          : "flex flex-col items-center justify-center bg-[var(--color-background)] w-full"
      }
    >
      <div id="loading"></div>
      <p className="text-2xl font-bold">Loading...</p>
    </div>
  );
};
