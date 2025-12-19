import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { googleMapsApiKey } from '@/apikeys';

export const withGoogleReCaptchaProvider = (Component: React.FC) => {
  return () => {
    return <GoogleReCaptchaProvider reCaptchaKey={googleMapsApiKey}>
      <Component />
    </GoogleReCaptchaProvider>;
  };
};