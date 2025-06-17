// app/UserOnboarding/_layout.tsx
import { Stack } from 'expo-router';

export default function UserOnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
