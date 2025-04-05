import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase'; // Import Supabase client

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

    //   Alert.alert('Success', 'Logged in successfully!');
      router.push('/MapScreen/MapScreen'); // Redirect user to home page after successful login
    } catch (error) {
      Alert.alert('Login Failed', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <Text style={styles.title}>Welcome to <Text style={{ color: '#5078F2' }}>Lift8</Text></Text>
      <Text style={styles.subtitle}>Ready to simplify your truck booking experience?</Text>

      {/* Form Fields */}
      <TextInput style={styles.input} placeholder="Email Id" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/Signup/Signup')}>
          <Text style={styles.loginLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/ForgetPassword/ForgetPassword')}>
          <Text style={styles.loginLink}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  input: { height: 48, backgroundColor: '#F0F0F0', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, color: '#1C1C1E' },
  button: { backgroundColor: '#1C1C1E', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { fontSize: 14, color: '#6B7280' },
  loginLink: { fontSize: 14, color: '#5078F2', fontWeight: '500' },
});

