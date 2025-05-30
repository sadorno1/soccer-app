// context/WorkoutContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

/* ---------- types ---------- */
interface Exercise {
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
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  permanent?: boolean;  // keep Quick Workout undeletable
  tag?: string;
  color?: string;
  [key: string]: any;
}

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (w: Workout) => void;
  deleteWorkout: (id: string) => void;
  addExerciseToWorkout: (workoutId: string, exercise: Exercise) => void;
}

/* ---------- context ---------- */
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: 'quick',
      name: 'Quick Workout',
      exercises: [],
      tag: 'Quick',
      color: '#0ea5e9',
      permanent: true,
    },
  ]);

  const addWorkout = (w: Workout) => setWorkouts((prev) => [...prev, w]);

  const deleteWorkout = (id: string) =>
    setWorkouts((prev) => prev.filter((w) => w.id !== id || w.permanent));

  const addExerciseToWorkout = (workoutId: string, exercise: Exercise) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? { ...w, exercises: [...w.exercises, exercise] }
          : w
      )
    );
  };

  return (
    <WorkoutContext.Provider
      value={{ workouts, addWorkout, deleteWorkout, addExerciseToWorkout }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

/* ---------- hook ---------- */
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within WorkoutProvider');
  return context;
};
