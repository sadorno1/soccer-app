import { COLORS } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Your logo */}
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* App name */}
        <Text style={styles.title}>Soccer Training</Text>
        
        {/* Loading indicator */}
        <ActivityIndicator 
          size="large" 
          color={COLORS.primary} 
          style={styles.loader}
        />
        
        {/* Optional subtitle */}
        <Text style={styles.subtitle}>Loading your workouts...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  loader: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
