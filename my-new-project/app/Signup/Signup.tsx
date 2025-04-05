import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase'; // Import Supabase client

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle signup
  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
        },
      });

      if (error) throw error;

      Alert.alert('Success', 'Check your email for confirmation!');
      router.push('/CheckEmail/CheckEmail'); // Navigate after successful signup
    } catch (error) {
      Alert.alert('Signup Failed', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Welcome to <Text style={{ color: '#5078F2' }}>Lift8</Text></Text>
      <Text style={styles.subtitle}>Ready to simplify your truck booking experience?</Text>

      {/* Form Fields */}
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email Id" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Create Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Re-enter the password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already a user? </Text>
        <TouchableOpacity onPress={() => router.push('/Login/Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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

