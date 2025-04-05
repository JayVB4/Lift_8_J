import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function CheckEmail() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Text style={styles.title}>Welcome to <Text style={{ color: '#5078F2' }}>Lift8</Text></Text>

      {/* Form Fields */}
      

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={()=>router.push('/Login/Login')}>
        <Text style={styles.buttonText} >Check Your Email</Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>We’ve sent you a email verification link, Please verify to proceed</Text>


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#1C1C1E',
  },
  button: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#5078F2',
    fontWeight: '500',
  },
});
