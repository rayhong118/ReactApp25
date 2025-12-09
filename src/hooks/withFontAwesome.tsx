/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas, far, fab);

export function withFontAwesome(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    return (
      <WrappedComponent {...props} />
    );
  };
}
