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
        // Check if user is still in the allowed users list
        try {
          const isAllowed = await checkUserAllowed(firebaseUser.email || '');
          if (!isAllowed) {
            // If user is no longer allowed, sign them out
            console.log('[AuthContext] User no longer in allowed list, signing out');
            await signOut(auth);
            setUser(null);
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('[AuthContext] Error checking user allowed status:', error);
          // On error, sign out for security
          await signOut(auth);
          setUser(null);
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