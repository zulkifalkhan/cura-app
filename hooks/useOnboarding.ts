import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useOnboarding() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        if (value === null) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status', error);
      } finally {
        setLoading(false);
      }
    };

    checkIfFirstLaunch();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status', error);
    }
  };

  return { loading, showOnboarding, completeOnboarding };
}
