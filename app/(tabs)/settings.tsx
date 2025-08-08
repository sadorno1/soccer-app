import { auth } from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';


export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login'); // redirect to login after logout
  };

  if (loading) {
    return (
      <View >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
              <Text style={GlobalStyles.header}>
              Settings
            </Text>
            </View>
      {user ? (
        <>
          <Text style={GlobalStyles.email}>Logged in as: {user.email}</Text>
          
          <TouchableOpacity style={GlobalStyles.startButton} onPress={handleSignOut}>
            <Text style={GlobalStyles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={GlobalStyles.email}>You are not logged in.</Text>
      )}
    </View>
  );
}

