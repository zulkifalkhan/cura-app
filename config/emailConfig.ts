

// app/config/emailConfig.ts
import Constants from 'expo-constants';

const RESEND_API_KEY = Constants.expoConfig?.extra?.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY is missing in app.config.ts or .env");
}

export { RESEND_API_KEY };