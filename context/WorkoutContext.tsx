import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  weight?: string;
  // add any progress fields you need, e.g. completedSets?: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  permanent?: boolean;
  tag?: string;
  color?: string;
}

export interface WorkoutContextType {
  workouts: Workout[];
  activeWorkoutId: string | null;
  addWorkout: (w: Workout) => void;
  deleteWorkout: (id: string) => void;
  addExerciseToWorkout: (workoutId: string, ex: Exercise) => void;
  deleteExerciseFromWorkout: (workoutId: string, exId: string) => void;
  setActiveWorkout: (id: string | null) => void;
  clearActiveWorkout: () => void;
  resetWorkoutProgress: (workoutId: string) => void;
  completeWorkoutSession: (workoutId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: 'quick',
      name: 'Quick Workout',
      exercises: [],
      permanent: true,
      tag: 'Quick',
      color: '#0ea5e9',
    },
  ]);

  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  /* ---------- CRUD helpers ---------- */
  const addWorkout = (w: Workout) => setWorkouts(prev => [...prev, w]);

  const deleteWorkout = (id: string) =>
    setWorkouts(prev => prev.filter(w => w.id !== id || w.permanent));

  const addExerciseToWorkout = (workoutId: string, ex: Exercise) =>
    setWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId ? { ...w, exercises: [...w.exercises, ex] } : w
      )
    );

  const deleteExerciseFromWorkout = (workoutId: string, exId: string) =>
    setWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? { ...w, exercises: w.exercises.filter(e => e.id !== exId) }
          : w
      )
    );

  /* ---------- session helpers ---------- */
  const setActiveWorkout = (id: string | null) => setActiveWorkoutId(id);
  const clearActiveWorkout = () => setActiveWorkoutId(null);

  const resetWorkoutProgress = (workoutId: string) =>
    setWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map(e => ({
                ...e,
                // reset any progress-tracking fields here
              })),
            }
          : w
      )
    );

  const completeWorkoutSession = (workoutId: string) => {
    resetWorkoutProgress(workoutId);   // wipe progress
    clearActiveWorkout();              // unset active flag
    console.log('[CONTEXT] activeWorkoutId after clear:', activeWorkoutId);
    

  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        activeWorkoutId,
        addWorkout,
        deleteWorkout,
        addExerciseToWorkout,
        deleteExerciseFromWorkout,
        setActiveWorkout,
        clearActiveWorkout,
        resetWorkoutProgress,
        completeWorkoutSession,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within a WorkoutProvider');
  return ctx;
};
