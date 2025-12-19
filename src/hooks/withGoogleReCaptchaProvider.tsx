import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { googleReCaptchaSiteKey } from '@/apikeys';

export const withGoogleReCaptchaProvider = (Component: React.FC) => {
  return () => {
    return <GoogleReCaptchaProvider reCaptchaKey={googleReCaptchaSiteKey}>
      <Component />
    </GoogleReCaptchaProvider>;
  };
};