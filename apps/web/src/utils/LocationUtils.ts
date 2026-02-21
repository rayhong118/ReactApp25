/**
 * Utility functions for Geolocation and Geocoding.
 */

/**
 * Promise-based wrapper for navigator.geolocation.getCurrentPosition
 */
export const getCurrentPosition = (
  options?: PositionOptions,
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

/**
 * Promise-based wrapper for google.maps.Geocoder.geocode
 */
export const reverseGeocode = (
  latlng: google.maps.LatLngLiteral,
): Promise<google.maps.GeocoderResponse> => {
  const geocoder = new google.maps.Geocoder();
  return geocoder.geocode({ location: latlng });
};

/**
 * Extracts city and state from Google Geocoder response results.
 */
export const extractCityAndState = (
  results: google.maps.GeocoderResult[],
): string | null => {
  const result = results[0];
  if (!result) return null;

  let city = "";
  let state = "";

  result.address_components.forEach((component) => {
    if (component.types.includes("locality")) {
      city = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1")) {
      state = component.short_name;
    }
  });

  return city && state ? `${city}, ${state}` : null;
};

/**
 * Maps Geolocation API error codes to user-friendly messages.
 */
export const getGeolocationErrorMessage = (
  error: GeolocationPositionError,
): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Permission denied. Please enable location in browser settings.";
    case error.POSITION_UNAVAILABLE:
      return "Position unavailable. GPS signal might be weak.";
    case error.TIMEOUT:
      return "Location request timed out.";
    default:
      return (
        error.message || "An unknown error occurred while fetching location."
      );
  }
};
