/* Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'




// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
export const db = getFirestore(app);
//export const auth = getAuth(app); // This should work now

*/
// lib/firebase.ts
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// this replaces getAuth(app)


// const auth = initializeAuth(app, {
//  persistence: getReactNativePersistence(AsyncStorage),
// });
export const db = getFirestore(app);
