import { COLORS } from '@/constants/Colors';
import { auth } from '@/lib/firebase';
import { GlobalStyles, SIZES, moderateScale, verticalScale } from '@/theme';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <Text style={GlobalStyles.title_auth}>Reset Password</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[GlobalStyles.input, styles.customInput]}
          selectionColor={COLORS.primary}
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
    <ActivityIndicator color={COLORS.background} />
  ) : (
    <Text style={GlobalStyles.buttonText}>
      {cooldown ? `Resend in ${cooldown}s` : 'Send Reset Link'}
    </Text>
  )}
</TouchableOpacity>
<TouchableOpacity onPress={() => router.replace('/login')}>
  <Text style={styles.backText}>← Back to Login</Text>
</TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.xl, // Increased padding
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: moderateScale(72),
    height: moderateScale(72),
    alignSelf: 'center',
    marginBottom: SIZES.xl, // Increased margin
    resizeMode: 'contain',
  },
  customInput: {
    // Override any system styling that causes yellow highlight
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(16),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.md,
    marginTop: SIZES.sm,
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  link: { 
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: SIZES.xs,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  message: { 
    textAlign: 'center', 
    color: COLORS.primary, 
    marginBottom: SIZES.sm,
    fontSize: SIZES.body,
  },
  error: { 
    textAlign: 'center', 
    color: COLORS.error, 
    marginBottom: SIZES.sm,
    fontSize: SIZES.body,
  },
  success: { 
    textAlign: 'center', 
    color: COLORS.accent, 
    marginBottom: SIZES.sm,
    fontSize: SIZES.body,
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: SIZES.body,
    fontWeight: '500',
    textAlign: 'center',
  },
});
