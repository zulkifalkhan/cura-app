import React from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function Index() {
  const { user } = useAuth();
  const { loading: onboardingLoading, showOnboarding } = useOnboarding();

  const isAuthLoading = user === undefined;

  const isLoading = onboardingLoading || isAuthLoading;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19949B" />
      </View>
    );
  }

  if (showOnboarding) {
    return <Redirect href="/Onboarding" />;
  }

  if (!user) {
    return <Redirect href="/Onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
