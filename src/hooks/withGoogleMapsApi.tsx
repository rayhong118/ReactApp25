import { googleMapsApiKey } from "@/apikeys";
import { useJsApiLoader } from "@react-google-maps/api";

export function withGoogleMapsApi(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: googleMapsApiKey,
      libraries: ["places"]
    });
    return (
      isLoaded ?
        <WrappedComponent {...props} />
        : null
    );
  };
}