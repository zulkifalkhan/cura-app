import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user} = useAuth();
  const { loading: onboardingLoading, showOnboarding } = useOnboarding();


  if ( onboardingLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19949B" />
      </View>
    );
  }

  if (showOnboarding) {
    return <Redirect href="/Onboarding" />;
  }

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19949B" />
      </View>
    );
  }

  if (user === null) {
    return <Redirect href="/SignIn" />;
  }

  return <Redirect href="/(tabs)" />;
}
