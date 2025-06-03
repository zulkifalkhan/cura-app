import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  // const { user } = useAuth();

  if (true) {
    return <Redirect href="/SignIn" />;
  }

  return <Redirect href="/(tabs)" />;
}
