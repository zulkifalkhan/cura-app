import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { resetPassword } from '@/services/AuthService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Something went wrong');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Missing Email', 'Please enter your email to reset your password.');
      return;
    }

    try {
      await resetPassword(resetEmail);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      setModalVisible(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Log in to manage your health with Cura</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don't have an account?{' '}
            <Text style={styles.link} onPress={() => router.push('/SignUp')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDesc}>
              Enter your email to receive a password reset link.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleForgotPassword}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#19949B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  forgot: {
    color: '#19949B',
    textAlign: 'right',
    width: '100%',
    marginBottom: 24,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#19949B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#19949B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 28,
    fontSize: 15,
    color: '#444',
  },
  link: {
    color: '#19949B',
    fontWeight: '700',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#19949B',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  cancelText: {
    color: '#19949B',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});
