import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import SignIn from './SignIn';
import SignUpScreen from './SignUp';
import OnboardingSlider from './Onboarding';

function MainStack() {

  return (
    <Stack
    >
      {/* Always define screens only once */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    // <AuthProvider>
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <MainStack onDone={()=> {}} />
        <StatusBar style="auto" />
      </ThemeProvider>
      </>
  );
}
