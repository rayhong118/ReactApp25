export const withDefaultPagePadding = (component: React.ReactNode) => {
  return <div className="px-5 py-20 md:p-20">{component}</div>;
};
