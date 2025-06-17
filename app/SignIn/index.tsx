import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.push('/(tabs)')
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity>
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
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#19949B', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  forgot: { color: '#19949B', textAlign: 'right', marginBottom: 24 },
  button: { backgroundColor: '#19949B', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  bottomText: { textAlign: 'center', marginTop: 24 },
  link: { color: '#19949B', fontWeight: 'bold' },
});

export default SignIn;