import { googleMapsApiKey } from "@/apikeys";
import { LoadScript } from "@react-google-maps/api";

export function withGoogleMapsApi(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    return (
      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
      >
        <WrappedComponent {...props} />
      </LoadScript>
    );
  };
}