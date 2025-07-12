import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { WorkoutProvider } from '@/context/WorkoutContext';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';

import { auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  /* ---------- assets & theme ---------- */
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  /* ---------- Firebase auth state ---------- */
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  /* ---------- Router guard ---------- */
  const segments = useSegments();        // e.g. ['(auth)', 'login']
  const router   = useRouter();

  useEffect(() => {
    if (!authReady) return;              // wait until Firebase finishes
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/login');          // force unauth users to /login
    } else if (user && inAuthGroup) {
      router.replace('/');               // logged-in users -> main app
    }
  }, [authReady, user, segments]);

  /* ---------- splash while loading everything ---------- */
  if (!fontsLoaded || !authReady) return null;

  /* ---------- UI ---------- */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
      <WorkoutProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* unauth screens */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* your existing tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </WorkoutProvider>
      </AuthProvider>

    </GestureHandlerRootView>
  );
}
