import { COLORS } from '@/constants/Colors';
import { auth, checkUserAllowed } from '@/lib/firebase';
import { GlobalStyles, SIZES, moderateScale, verticalScale } from '@/theme';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
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


export default function LoginScreen({ navigation }: any) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) return setError('Enter both email and password');
    setLoading(true);
    try {
      // First check if the user is allowed to access the app
      const isAllowed = await checkUserAllowed(email.trim());
      if (!isAllowed) {
        setError('Email not authorized. Contact an administrator to get access.');
        return;
      }

      // If user is allowed, proceed with sign in
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      // Handle Firebase auth errors
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.');
      } else {
        setError('e.message');
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
        {/* logo */}
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

        <Text style={GlobalStyles.title_auth}>Welcome back</Text>

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
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.textMuted} 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[GlobalStyles.input, styles.customInput]}
          selectionColor={COLORS.primary}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={GlobalStyles.buttonText}>Sign in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.link}>No account? Create one</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/forgot_password')}>
        <Text style={styles.link}>Forgot password?</Text>
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
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  error: { 
    color: COLORS.error, 
    textAlign: 'center', 
    marginBottom: SIZES.md, 
    fontSize: SIZES.body,
  },
});
