import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';

import { auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  console.log('🚀 RootLayout: Starting app...');
  
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  console.log('🚀 RootLayout: State initialized, fontsLoaded:', fontsLoaded);

  useEffect(() => {
    console.log('🚀 RootLayout: Setting up auth listener...');
    try {
      const unsub = onAuthStateChanged(auth, u => {
        console.log('🚀 RootLayout: Auth state changed:', u ? 'User logged in' : 'No user');
        setUser(u);
        setAuthReady(true);
      });
      console.log('🚀 RootLayout: Auth listener setup complete');
      return unsub;
    } catch (error) {
      console.error('🚀 RootLayout: Auth listener setup failed:', error);
      setAuthReady(true); // Set ready even on error to prevent infinite loading
    }
  }, []);

  /* ---------- Router guard ---------- */
  const segments = useSegments();        
  const router   = useRouter();

  useEffect(() => {
    console.log('🚀 RootLayout: Router guard check - authReady:', authReady, 'user:', !!user);
    if (!authReady) return;              
    const inAuthGroup = segments[0] === '(auth)';

    console.log('🚀 RootLayout: Navigation logic - inAuthGroup:', inAuthGroup, 'segments:', segments);
    
    if (!user && !inAuthGroup) {
      console.log('🚀 RootLayout: Redirecting to login');
      router.replace('/login');         
    } else if (user && inAuthGroup) {
      console.log('🚀 RootLayout: Redirecting to main app');
      router.replace('/');             
    }
  }, [authReady, user, segments]);

  if (!fontsLoaded || !authReady) return null;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
