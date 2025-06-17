import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { resetPassword } from '@/services/AuthService';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert("Missing Email", "Please enter your email to reset your password.");
      return;
    }

    try {
      await resetPassword(resetEmail);
      Alert.alert("Success", "Password reset email sent. Please check your inbox.");
      setModalVisible(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      Alert.alert("Error", error.message || "Something went wrong. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      {/* Forgot Password Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDesc}>Enter your email to receive a password reset link.</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#19949B', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  forgot: { color: '#19949B', textAlign: 'right', marginBottom: 24 },
  button: { backgroundColor: '#19949B', padding: 14, borderRadius: 8 },
  modalButton: { backgroundColor: '#19949B', padding: 14, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  bottomText: { textAlign: 'center', marginTop: 24 },
  link: { color: '#19949B', fontWeight: 'bold' },

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

export default SignIn;

export const options = {
  headerShown: false,
};
