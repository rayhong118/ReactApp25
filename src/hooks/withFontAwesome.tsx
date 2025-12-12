
export function withFontAwesome(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    return (
      <WrappedComponent {...props} />
    );
  };
}
