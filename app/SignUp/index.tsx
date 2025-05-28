import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';



export default function SignUpScreen() {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput style={styles.input} placeholder="Name" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
  
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
  
        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('SignIn' as never)}>
            Sign In
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
  