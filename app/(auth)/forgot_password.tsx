import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);   
  const router = useRouter();


  const startCooldown = () => {
    setCooldown(30);
    const id = setInterval(() => {
        setCooldown((c) => {
        if (c <= 1) {
            clearInterval(id);
            return 0;
        }
        return c - 1;
        });
    }, 1000);
    };

    // Function to handle password reset
  const handleReset = async () => {
  setMessage(null);
  setIsSuccess(false);

  if (!email) return setMessage('Enter your email');

  try {
    setLoading(true);
    await sendPasswordResetEmail(auth, email.trim());

    // success notice
    setIsSuccess(true);
    setMessage(
      'Email sent! It can take up to 3 minutes—check your inbox and spam folder.'
    );
    startCooldown();
  } catch (e: any) {
    setMessage(e.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {message && (
  <Text style={[styles.message, isSuccess ? styles.success : styles.error]}>
    {message}
  </Text>
)}

       <TouchableOpacity
  style={[
    styles.button,
    (loading || !!cooldown) && styles.buttonDisabled,
  ]}
  onPress={handleReset}
  disabled={loading || !!cooldown}
>
  {loading ? (
    <ActivityIndicator />
  ) : (
    <Text style={styles.buttonText}>
      {cooldown ? `Resend in ${cooldown}s` : 'Send Reset Link'}
    </Text>
  )}
</TouchableOpacity>
<TouchableOpacity onPress={() => router.replace('/login')}>
  <Text style={styles.link}>Back to login</Text>
</TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 4 },
  message: { textAlign: 'center', color: '#2563eb', marginBottom: 12 },
  error:   { textAlign: 'center', color: '#dc2626', marginBottom: 12 },
success: { textAlign: 'center', color: '#16a34a', marginBottom: 12 },

});
