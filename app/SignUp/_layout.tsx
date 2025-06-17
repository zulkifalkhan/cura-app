// app/SignUp/_layout.tsx
import { Stack } from 'expo-router';

export default function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
