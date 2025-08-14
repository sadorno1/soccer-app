// app/signup.tsx
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { COLORS } from '@/constants/Colors';
import { auth, checkUserAllowed } from '@/lib/firebase';
import { GlobalStyles, SIZES, moderateScale, verticalScale } from '@/theme';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // iOS hack to disable AutoFill yellow styling
  const iosNoAutofill =
    Platform.OS === 'ios'
      ? { textContentType: 'oneTimeCode' as const, autoComplete: 'off' as const }
      : {};

  const handleSignup = async () => {
  setError(null);
  if (!email || !password) return setError('Enter email and password');
  if (password !== confirm) return setError('Passwords do not match');

  try {
    setLoading(true);
    
    // First check if the user is allowed to access the app
    const isAllowed = await checkUserAllowed(email.trim());
    if (!isAllowed) {
      setError('Email not authorized. Contact an administrator to get access.');
      return;
    }

    // If user is allowed, proceed with account creation
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    router.replace('/login'); 
  } catch (e: any) {
    // Handle Firebase auth errors
    if (e.code === 'auth/email-already-in-use') {
      setError('Email already in use. Try logging in instead.');
    } else if (e.code === 'auth/invalid-email') {
      setError('Invalid email address');
    } else if (e.code === 'auth/weak-password') {
      setError('Password should be at least 6 characters');
    } else {
      setError(e.message);
    }
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
        <Text style={GlobalStyles.title_auth}>Create an account</Text>

        <TextInput
          placeholder="Email"
        placeholderTextColor={COLORS.textMuted} 
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[GlobalStyles.input, styles.customInput]}
          selectionColor={COLORS.primary}
        />
        
        {/* Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[GlobalStyles.input, styles.customInput, styles.input]}
            selectionColor={COLORS.primary}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            {...iosNoAutofill}
          />
        </View>
        
        {/* Confirm password */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[GlobalStyles.input, styles.customInput, styles.input]}
            selectionColor={COLORS.primary}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            {...iosNoAutofill}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={GlobalStyles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        {/* Use Link for client-side navigation in Expo Router */}
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={() => router.push('/login')} style={styles.backButton}>
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
    padding: SIZES.xl, 
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
    marginBottom: SIZES.xl, 
    resizeMode: 'contain',
  },
  customInput: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    fontFamily: 'System',
    fontSize: moderateScale(16),
  },
  inputWrapper: {
    backgroundColor: COLORS.background, 
    borderRadius: SIZES.xs + SIZES.xs,
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    backgroundColor: 'transparent', 
    color: COLORS.text,
    marginBottom: 0, 
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(16),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.lg, 
    marginTop: SIZES.md, 
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  link: { 
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: SIZES.md, 
    marginBottom: SIZES.sm, 
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  error: { 
    color: COLORS.error, 
    textAlign: 'center', 
    marginBottom: SIZES.md, 
    fontSize: SIZES.body,
  },
  backButton: {
    marginTop: SIZES.md,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: SIZES.body,
    fontWeight: '500',
  },
});
