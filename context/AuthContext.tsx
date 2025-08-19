// context/AuthContext.tsx
import { auth, checkUserAllowed } from '@/lib/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // For app startup, trust that the user was previously validated
        // Only check allowed status if they don't have a valid token or on specific actions
        setUser(firebaseUser);
        
        // Optional: You could do a background check without signing out on error
        try {
          const isAllowed = await checkUserAllowed(firebaseUser.email || '');
          if (!isAllowed) {
            console.log('[AuthContext] User no longer in allowed list, signing out');
            await signOut(auth);
            setUser(null);
          }
        } catch (error) {
          // Don't sign out on error - just log it
          // The user might not have network, Firebase might be loading, etc.
          console.warn('[AuthContext] Could not verify user allowed status (keeping signed in):', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);