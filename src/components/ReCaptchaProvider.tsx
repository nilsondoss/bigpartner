import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface ReCaptchaProviderProps {
  children: ReactNode;
}

/**
 * ReCAPTCHA Provider Component
 * 
 * Wraps the application with Google reCAPTCHA v3 protection.
 * This provides invisible CAPTCHA verification for forms without user interaction.
 * 
 * Setup Instructions:
 * 1. Get your reCAPTCHA v3 site key from: https://www.google.com/recaptcha/admin
 * 2. Add VITE_RECAPTCHA_SITE_KEY to your .env file
 * 3. Wrap your app or specific routes with this provider
 * 
 * @example
 * ```tsx
 * <ReCaptchaProvider>
 *   <App />
 * </ReCaptchaProvider>
 * ```
 */
export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Use a test key if no site key is configured
  // This allows development without CAPTCHA setup while keeping the provider active
  const effectiveSiteKey = 
    siteKey && siteKey !== 'your_recaptcha_site_key_here' 
      ? siteKey 
      : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google's test key

  if (!siteKey || siteKey === 'your_recaptcha_site_key_here') {
    console.warn('⚠️ reCAPTCHA site key not configured. Using test key for development. Forms will work but CAPTCHA verification is disabled.');
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={effectiveSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

/**
 * Hook to use reCAPTCHA in your components
 * 
 * @example
 * ```tsx
 * import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
 * 
 * function MyForm() {
 *   const { executeRecaptcha } = useGoogleReCaptcha();
 *   
 *   const handleSubmit = async () => {
 *     if (!executeRecaptcha) {
 *       console.log('Execute recaptcha not yet available');
 *       return;
 *     }
 *     
 *     const token = await executeRecaptcha('form_submit');
 *     // Send token to backend for verification
 *   };
 * }
 * ```
 */
