import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

function MainStack() {

  return (
    <Stack
    screenOptions={
      {
        headerShown:false
      }
    }
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        options={{ headerShown: false,gestureEnabled:false }}
      />
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false, }}
      />
       <Stack.Screen
        name="UserOnboarding"
        options={{
          headerShown: false,
        }}
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
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <MainStack  />
        <StatusBar style="auto" />
      </ThemeProvider>
      </AuthProvider>
  );
}
