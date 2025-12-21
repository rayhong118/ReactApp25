import { useSetUserLocation } from "@/utils/UserLocationAtom";
import { useEffect } from "react";

export function withUserLocation(WrappedComponent: React.ComponentType) {
  const setUserLocation = useSetUserLocation();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error(`Error: ${err.message}`);
      },
      {
        enableHighAccuracy: false, // better precision
        timeout: 5000, // max wait time
        maximumAge: 0, // no cached position
      }
    );
  };

  return function (props: any) {
    return <WrappedComponent {...props} />;
  };
}
