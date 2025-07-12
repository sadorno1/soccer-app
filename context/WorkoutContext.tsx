// context/WorkoutContext.tsx
import { db } from '@/lib/firebase';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  limit,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { useAuth } from './AuthContext';

/* ---------- types ---------- */
export interface Exercise {
  id: string;
  name: string;
  subcategory: string;
  positionCategory: string[];
  setup: string;
  description: string;
  uses_tracking: boolean;
  sets: number;
  set_duration: number;
  rest: number;
  perFoot?: boolean;
  videoUrls: { default?: string; left?: string; right?: string };
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  permanent?: boolean;
  tag?: string;
  color?: string;
  userId?: string;
  createdAt?: Date;
  lastCompleted?: Date;
}

interface WorkoutContextType {
  workouts: Workout[];
  activeWorkoutId: string | null;
  addWorkout: (workout: Omit<Workout, 'id' | 'userId'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  setActiveWorkout: (id: string) => void;
  clearActiveWorkout: () => void;
  addExerciseToWorkout: (workoutId: string, exercise: Omit<Exercise, 'id'>) => Promise<void>;
  deleteExerciseFromWorkout: (workoutId: string, exerciseId: string) => Promise<void>;
  completeWorkoutSession: (workoutId: string) => Promise<void>;
  updateExerciseInWorkout: (
    workoutId: string, 
    exerciseId: string, 
    updates: Partial<Omit<Exercise, 'id'>>
  ) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  activeWorkoutId: null,
  addWorkout: async () => {},
  deleteWorkout: async () => {},
  setActiveWorkout: () => {},
  clearActiveWorkout: () => {},
  addExerciseToWorkout: async () => {},
  deleteExerciseFromWorkout: async () => {},
  completeWorkoutSession: async () => {},
  updateExerciseInWorkout: async () => {},
});

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  // Fetch workouts for current user
  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      return;
    }

    // Ensure Quick Workout exists when user logs in
    ensureQuickWorkoutExists(user.uid).catch(console.error);

    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to Date objects
        createdAt: doc.data().createdAt?.toDate(),
        lastCompleted: doc.data().lastCompleted?.toDate()
      })) as Workout[];

      // Sort with Quick Workout first, others by name
      const sorted = workoutsData.sort((a, b) => 
        a.tag === 'Quick' ? -1 : 
        b.tag === 'Quick' ? 1 : 
        a.name.localeCompare(b.name)
      );

      setWorkouts(sorted);
    }, (error) => {
      console.error('Error fetching workouts:', error);
    });

    return unsubscribe;
  }, [user]);

  const ensureQuickWorkoutExists = async (userId: string) => {
    try {
      // First check local state to avoid unnecessary Firestore reads
      const hasQuickWorkout = workouts.some(w => w.tag === 'Quick' && w.userId === userId);
      if (hasQuickWorkout) return;

      // Then verify with Firestore
      const quickWorkoutQuery = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        where('tag', '==', 'Quick'),
        limit(1)
      );

      const snapshot = await getDocs(quickWorkoutQuery);
      if (snapshot.empty) {
        await createQuickWorkout(userId);
      }
    } catch (error) {
      console.error('Error ensuring Quick Workout exists:', error);
      // Fallback attempt if the query fails
      try {
        await createQuickWorkout(userId);
      } catch (createError) {
        console.error('Failed to create Quick Workout:', createError);
      }
    }
  };

  const createQuickWorkout = async (userId: string) => {
    try {
      await addDoc(collection(db, 'workouts'), {
        name: 'Quick Workout',
        exercises: [],
        tag: 'Quick',
        color: '#34d399',
        userId: userId,
        permanent: true,
        createdAt: new Date(0) // Very old date to ensure it stays first
      });
    } catch (error) {
      console.error('Error creating Quick Workout:', error);
      throw error;
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await addDoc(collection(db, 'workouts'), {
        ...workout,
        userId: user.uid,
        createdAt: new Date(),
        exercises: [],
      });
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const workout = workouts.find(w => w.id === id);
      if (workout?.permanent) {
        throw new Error('Cannot delete permanent workouts');
      }
      await deleteDoc(doc(db, 'workouts', id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  };

  const addExerciseToWorkout = async (workoutId: string, exercise: Omit<Exercise, 'id'>) => {
    try {
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout) throw new Error('Workout not found');

      const exerciseWithId = {
        ...exercise,
        id: Date.now().toString(),
      };

      const updateData = {
        exercises: arrayUnion(exerciseWithId)
      };

      await updateDoc(doc(db, 'workouts', workoutId), updateData);
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  };

  const deleteExerciseFromWorkout = async (workoutId: string, exerciseId: string) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      const workout = workouts.find(w => w.id === workoutId);
      
      if (workout) {
        const exerciseToRemove = workout.exercises.find(e => e.id === exerciseId);
        if (exerciseToRemove) {
          await updateDoc(workoutRef, {
            exercises: arrayRemove(exerciseToRemove)
          });
        }
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  };

  const updateExerciseInWorkout = async (
    workoutId: string,
    exerciseId: string,
    updates: Partial<Omit<Exercise, 'id'>>
  ) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      const workout = workouts.find(w => w.id === workoutId);
      
      if (workout) {
        const exerciseToUpdate = workout.exercises.find(e => e.id === exerciseId);
        if (!exerciseToUpdate) return;

        // Remove old and add updated version
        await updateDoc(workoutRef, {
          exercises: arrayRemove(exerciseToUpdate)
        });
        await updateDoc(workoutRef, {
          exercises: arrayUnion({ ...exerciseToUpdate, ...updates })
        });
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  };

  const completeWorkoutSession = async (workoutId: string) => {
    try {
      setActiveWorkoutId(null);
      await updateDoc(doc(db, 'workouts', workoutId), {
        lastCompleted: new Date()
      });
    } catch (error) {
      console.error('Error completing workout session:', error);
      throw error;
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      activeWorkoutId,
      addWorkout,
      deleteWorkout,
      setActiveWorkout: setActiveWorkoutId,
      clearActiveWorkout: () => setActiveWorkoutId(null),
      addExerciseToWorkout,
      deleteExerciseFromWorkout,
      completeWorkoutSession,
      updateExerciseInWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export const useWorkout = () => useContext(WorkoutContext);