import { googleMapsApiKey } from "@/apikeys";
import { LoadScript, useJsApiLoader } from "@react-google-maps/api";

export function withGoogleMapsApi(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: googleMapsApiKey
    });
    return (
      !isLoaded ?
        <LoadScript
          googleMapsApiKey={googleMapsApiKey}
          libraries={["places"]}
        >
          <WrappedComponent {...props} />
        </LoadScript> : <WrappedComponent {...props} />
    );
  };
}