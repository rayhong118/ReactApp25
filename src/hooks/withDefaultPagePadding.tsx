export const withDefaultPagePadding = (component: React.ReactNode) => {
  return (
    <div className="px-5 py-20 md:px-10 max-w-7xl mx-auto">{component}</div>
  );
};
