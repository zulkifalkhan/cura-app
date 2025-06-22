// app/config/aiConfig.ts
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants?.expoConfig?.extra?.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in your config.");
}

export { OPENAI_API_KEY };
