import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (!user) {
    return <Redirect href="/SignIn" />;
  }

  return <Redirect href="/(tabs)" />;
}