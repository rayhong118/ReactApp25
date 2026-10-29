export const firebaseApiKey: string =
  import.meta.env.VITE_FIREBASE_API_KEY || "dummy";
export const googleMapsApiKey: string =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "dummy";
export const googleReCaptchaSiteKey: string =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || "dummy";
export const tursoDatabaseUrl: string =
  import.meta.env.TURSO_DATABASE_URL ||
  import.meta.env.VITE_TURSO_DATABASE_URL ||
  "";
export const tursoAuthToken: string =
  import.meta.env.TURSO_AUTH_TOKEN ||
  import.meta.env.VITE_TURSO_AUTH_TOKEN ||
  "";
