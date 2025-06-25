import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.push('/SignIn');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Image
            source={require('../../assets/images/hospital.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>Welcome to Cura 👋</Text>
          <Text style={styles.subtitle}>Your Personal Health AI Assistant 🤖💊</Text>

          <View style={styles.pointsContainer}>
            <Text style={styles.point}>📈 Track your health metrics easily</Text>
            <Text style={styles.point}>🧠 Get personalized AI recommendations</Text>
            <Text style={styles.point}>⏱️ Stay on top of your appointments & medications</Text>
            <Text style={styles.point}>💬 Smart insights for a better lifestyle</Text>
            <Text style={styles.point}>🌿 Designed for your wellness journey</Text>
          </View>
        </ScrollView>

        {/* Sticky Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#19949B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#19949B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  pointsContainer: {
    alignSelf: 'stretch',
  },
  point: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#19949B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
