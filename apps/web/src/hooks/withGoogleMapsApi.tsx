import { Loading } from "@/components/Loading";
import { useJsApiLoader } from "@react-google-maps/api";
import { googleMapsApiKey } from "@/apikeys";
import { ErrorMessagePanel } from "@/components/ErrorMessagePanel";

type Library = "places" | "drawing" | "geometry" | "visualization";
const LIBRARIES: Library[] = ["places"];

export function withGoogleMapsApi(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    const { isLoaded, loadError } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: googleMapsApiKey,
      libraries: LIBRARIES,
    });

    if (loadError) {
      return (
        <ErrorMessagePanel
          message={`Failed to load Google Maps API. Please check your internet connection.`}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return isLoaded ? <WrappedComponent {...props} /> : <Loading />;
  };
}
