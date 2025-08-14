// context/WorkoutContext.tsx
import { db } from '@/lib/firebase';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
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
  max_is_good?: boolean; 
  successful_reps?: number; 
  sets: number;
  set_duration?: number;
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
  deleteAllWorkouts: () => Promise<void>;
  setActiveWorkout: (id: string) => void;
  clearActiveWorkout: () => void;
  addExerciseToWorkout: (workoutId: string, exercise: Exercise) => Promise<void>;
  deleteExerciseFromWorkout: (workoutId: string, exerciseId: string) => Promise<void>;
  completeWorkoutSession: (workoutId: string) => Promise<void>;
  updateExerciseInWorkout: (
    workoutId: string, 
    exerciseId: string, 
    updates: Partial<Omit<Exercise, 'id'>>
  ) => Promise<void>;
  syncExerciseUpdates: (updatedExercise: Exercise, isAdminUpdate?: boolean) => Promise<void>;
  syncExerciseDeletes: (deletedExercise: Exercise, isAdminDelete?: boolean) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  activeWorkoutId: null,
  addWorkout: async () => {},
  deleteWorkout: async () => {},
  deleteAllWorkouts: async () => {},
  setActiveWorkout: () => {},
  clearActiveWorkout: () => {},
  addExerciseToWorkout: async () => {},
  deleteExerciseFromWorkout: async () => {},
  completeWorkoutSession: async () => {},
  updateExerciseInWorkout: async () => {},
  syncExerciseUpdates: async () => {},
  syncExerciseDeletes: async () => {},
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
        createdAt: new Date(0) 
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

  const addExerciseToWorkout = async (workoutId: string, exercise: Exercise) => {
    try {
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout) throw new Error('Workout not found');

      const cleanExercise = {
        id: exercise.id,
        name: exercise.name || '',
        subcategory: exercise.subcategory || '',
        positionCategory: Array.isArray(exercise.positionCategory) ? exercise.positionCategory : [],
        setup: exercise.setup || '',
        description: exercise.description || '',
        uses_tracking: !!exercise.uses_tracking,
        max_is_good: exercise.max_is_good || false,
        successful_reps: exercise.successful_reps || 0,
        sets: exercise.sets || 1,
        set_duration: exercise.set_duration || 0,
        rest: exercise.rest || 60,
        perFoot: !!exercise.perFoot,
        videoUrls: exercise.videoUrls || {}
      };


      const updateData = {
        exercises: arrayUnion(cleanExercise)
      };

      await updateDoc(doc(db, 'workouts', workoutId), updateData);
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  };

  const deleteAllWorkouts = async () => {
    if (!user) return;
    
    try {
      const deletePromises = workouts.map(workout => 
        deleteDoc(doc(db, 'workouts', workout.id))
      );
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting all workouts:', error);
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
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout) throw new Error('Workout not found');

      // Build a type-safe update payload
      const updates: {
        lastCompleted: Date;
        exercises?: Exercise[];  
      } = {
        lastCompleted: new Date(),
      };

      if (workout.tag === 'Quick') {
        updates.exercises = [];  
      }

      await updateDoc(doc(db, 'workouts', workoutId), updates);

      setActiveWorkoutId(null);   
    } catch (err) {
      console.error('Error completing workout session:', err);
      throw err;
    }
  };

  // Sync exercise updates across all workouts (admin updates affect all users)
  const syncExerciseUpdates = async (updatedExercise: Exercise, isAdminUpdate = false) => {
    if (!user) return;
    
    try {

      if (isAdminUpdate) {
        
        // Get ALL workouts and filter in JavaScript (since Firestore can't query nested object fields in arrays)
        const allWorkoutsQuery = query(collection(db, 'workouts'));
        const allWorkoutsSnapshot = await getDocs(allWorkoutsQuery);
        
        // Log all workout owners for debugging
        const workoutOwners = new Set();
        allWorkoutsSnapshot.docs.forEach(doc => {
          const data = doc.data() as Workout;
          workoutOwners.add(data.userId);
        });
        
        // Filter workouts that contain this exercise
        const workoutsToUpdate = [];
        for (const workoutDoc of allWorkoutsSnapshot.docs) {
          const workoutData = workoutDoc.data() as Workout;
          if (workoutData.exercises && workoutData.exercises.some(ex => ex.id === updatedExercise.id)) {
            workoutsToUpdate.push({ doc: workoutDoc, data: workoutData });
          }
        }
      
        // Update each workout
        for (const { doc: workoutDoc, data: workoutData } of workoutsToUpdate) {
          const exercisesToUpdate = workoutData.exercises.filter(ex => ex.id === updatedExercise.id);
          
          for (const oldExercise of exercisesToUpdate) {
            
            await updateDoc(doc(db, 'workouts', workoutDoc.id), {
              exercises: arrayRemove(oldExercise)
            });
            await updateDoc(doc(db, 'workouts', workoutDoc.id), {
              exercises: arrayUnion(updatedExercise)
            });
            
          }
        }
        
      } else {
        // Regular user update: only sync current user's workouts
        const userWorkouts = workouts.filter(workout => 
          workout.exercises.some(ex => ex.id === updatedExercise.id)
        );

        // Update each workout that contains this exercise
        for (const workout of userWorkouts) {
          const exerciseIndex = workout.exercises.findIndex(ex => ex.id === updatedExercise.id);
          if (exerciseIndex !== -1) {
            const oldExercise = workout.exercises[exerciseIndex];

            await updateDoc(doc(db, 'workouts', workout.id), {
              exercises: arrayRemove(oldExercise)
            });
            await updateDoc(doc(db, 'workouts', workout.id), {
              exercises: arrayUnion(updatedExercise)
            });
            
          }
        }
        
      }
      
      console.log(' ========== SYNC EXERCISE UPDATES END ==========');
    } catch (error) {
      console.error(' Error syncing exercise updates:', error);
    }
  };

  // Sync exercise deletions across all workouts (admin deletions affect all users)
  const syncExerciseDeletes = async (deletedExercise: Exercise, isAdminDelete = false) => {
    if (!user) return;
    
    try {
      
      if (isAdminDelete) {
        // Admin delete: remove from ALL workouts in the database
        
        const allWorkoutsQuery = query(collection(db, 'workouts'));
        const allWorkoutsSnapshot = await getDocs(allWorkoutsQuery);
        
        // Log all workout owners for debugging
        const workoutOwners = new Set();
        allWorkoutsSnapshot.docs.forEach(doc => {
          const data = doc.data() as Workout;
          workoutOwners.add(data.userId);
        });
        
        // Filter workouts that contain this exercise
        const workoutsToUpdate = [];
        for (const workoutDoc of allWorkoutsSnapshot.docs) {
          const workoutData = workoutDoc.data() as Workout;
          if (workoutData.exercises && workoutData.exercises.some(ex => ex.id === deletedExercise.id)) {
            workoutsToUpdate.push({ doc: workoutDoc, data: workoutData });
          }
        }
        
        
        // Remove exercise from each workout
        for (const { doc: workoutDoc, data: workoutData } of workoutsToUpdate) {
          const exercisesToRemove = workoutData.exercises.filter(ex => ex.id === deletedExercise.id);
          
          for (const exerciseToRemove of exercisesToRemove) {            
            await updateDoc(doc(db, 'workouts', workoutDoc.id), {
              exercises: arrayRemove(exerciseToRemove)
            });
            
          }
        }
        
      } else {
        
        const userWorkouts = workouts.filter(workout => 
          workout.exercises.some(ex => ex.id === deletedExercise.id)
        );
  

        // Remove the exercise from each workout that contains it
        for (const workout of userWorkouts) {
          const exerciseToRemove = workout.exercises.find(ex => ex.id === deletedExercise.id);
          if (exerciseToRemove) {
            await updateDoc(doc(db, 'workouts', workout.id), {
              exercises: arrayRemove(exerciseToRemove)
            });
            
          }
        }
        
      }
      
      console.log(' ========== SYNC EXERCISE DELETES END ==========');
    } catch (error) {
      console.error(' Error syncing exercise deletions:', error);
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      activeWorkoutId,
      addWorkout,
      deleteWorkout,
      deleteAllWorkouts,
      setActiveWorkout: setActiveWorkoutId,
      clearActiveWorkout: () => setActiveWorkoutId(null),
      addExerciseToWorkout,
      deleteExerciseFromWorkout,
      completeWorkoutSession,
      updateExerciseInWorkout,
      syncExerciseUpdates,
      syncExerciseDeletes,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export const useWorkout = () => useContext(WorkoutContext);