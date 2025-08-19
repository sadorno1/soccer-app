import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Firebase core - use specific imports for React Native compatibility
import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';

// Firebase auth - React Native compatible imports
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  initializeAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';

// Firebase firestore
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';

// Firebase storage
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'firebase/storage';

// Firebase configuration - try to get from environment variables first, fallback to app config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebase?.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.firebase?.authDomain,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || Constants.expoConfig?.extra?.firebase?.databaseURL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.firebase?.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.firebase?.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.firebase?.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || Constants.expoConfig?.extra?.firebase?.appId,
  // measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, // REMOVED: Causes crashes in React Native
};

// Debug: Log config to help diagnose issues (only in development)
if (__DEV__) {
  console.log('Firebase config loaded:', {
    apiKey: firebaseConfig.apiKey ? '✓ Present' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Present' : '✗ Missing',
    projectId: firebaseConfig.projectId ? '✓ Present' : '✗ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✓ Present' : '✗ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Present' : '✗ Missing',
    appId: firebaseConfig.appId ? '✓ Present' : '✗ Missing',
  });
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth - modern Firebase handles React Native persistence automatically
let auth: Auth;
try {
  // Try to get existing auth instance first
  auth = getAuth(app);
} catch (error: any) {
  // If that fails, initialize a new one
  auth = initializeAuth(app);
}

// Helper function to check if user is in allowed users list
export const checkUserAllowed = async (email: string): Promise<boolean> => {
  try {
    const trimmedEmail = email.toLowerCase().trim();
    
    // First check if user is an admin (admins are automatically allowed)
    if (trimmedEmail === 'samantha.adorno30@gmail.com') {
      return true;
    }
    
    // Check admin users list in database
    try {
      const adminUsersRef = doc(db, 'settings', 'adminUsers');
      const adminUsersSnap = await getDoc(adminUsersRef);
      if (adminUsersSnap.exists()) {
        const adminEmails = adminUsersSnap.data().emails || [];
        if (adminEmails.includes(trimmedEmail)) {
          return true;
        }
      }
    } catch (adminError) {
      console.log('Could not check admin list:', adminError);
    }
    
    // If not an admin, check the allowed users list
    const allowedUsersRef = doc(db, 'settings', 'allowedUsers');
    const allowedUsersSnap = await getDoc(allowedUsersRef);
    
    if (allowedUsersSnap.exists()) {
      const allowedEmails = allowedUsersSnap.data().emails || [];
      return allowedEmails.includes(trimmedEmail);
    }
    
    // If no allowed users list exists, deny access by default
    return false;
  } catch (error) {
    console.error('Error checking allowed users:', error);
    // On error, deny access for security
    return false;
  }
};

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

// Re-export auth functions for convenience
export {
  createUserWithEmailAndPassword, getIdTokenResult, onAuthStateChanged,
  sendPasswordResetEmail, signInWithEmailAndPassword,
  signOut, updateProfile, User
};

// Re-export Firestore functions for convenience
  export {
    addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot,
    query, setDoc, updateDoc, where, writeBatch
  };

// Re-export Storage functions for convenience
  export {
    deleteObject, getDownloadURL, ref,
    uploadBytes
  };

  export { app };

