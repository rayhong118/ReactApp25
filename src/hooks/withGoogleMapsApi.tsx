import { googleMapsApiKey } from "@/apikeys";
import { useJsApiLoader } from "@react-google-maps/api";

type Library = "places" | "drawing" | "geometry" | "visualization";
const LIBRARIES: Library[] = ["places"];

export function withGoogleMapsApi(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: googleMapsApiKey,
      libraries: LIBRARIES,
    });

    return isLoaded ? <WrappedComponent {...props} /> : null;
  };
}
