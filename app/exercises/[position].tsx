//[POSITION]
import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';
import { useWorkout, Exercise as WorkoutExercise } from '@/context/WorkoutContext';
// import { sampleExercises } from '@/data/sampleExercises';
import { db } from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

/* ---------- helper maps ---------- */
const SUBCATEGORY_COLORS: Record<string, string> = {
  'Ball Manipulation': '#FFA726',
  Dribbling: '#66BB6A',
  Crossing: '#42A5F5',
  Finishing: '#EF5350',
  'Ball Striking': '#AB47BC',
  Clearances: '#8D6E63',
  'Passing/Receiving': '#26A69A',
  'Speed of Play': '#78909C',
  Juggling: '#FFCA28',
};

const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
const titleCase = (slug: string) =>
  slug
    .split('-')                            
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Type matching Firestore document shape (id is included here)
type FirestoreExercise = Partial<WorkoutExercise> & { id: string; name: string; subcategory: string; positionCategory: string[] };

export default function PositionExerciseScreen() {
  const { position, workoutId } = useLocalSearchParams<{
    position: string;
    workoutId?: string;
  }>();
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkout();

  const [exercises, setExercises] = useState<FirestoreExercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all exercises from Firestore
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { getDocs, collection } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, 'exercises'));
        if (!mounted) return;
        const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as FirestoreExercise[];
        setExercises(items);
      } catch (e) {
        console.error('Failed to load exercises:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- filter ---------- */
  const filtered = useMemo(() => {
    if (position === 'all-positions') return exercises;
    return exercises.filter((ex) =>
      (ex.positionCategory || []).map(normalize).includes(String(position))
    );
  }, [exercises, position]);

  /* ---------- sort: subcategory → name ---------- */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.subcategory !== b.subcategory) {
        return (a.subcategory || '').localeCompare(b.subcategory || '');
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [filtered]);

  const handleAdd = (exercise: FirestoreExercise) => {
    if (workoutId) {
      const exerciseForWorkout: WorkoutExercise = {
        id: exercise.id, 
        name: exercise.name!,
        subcategory: exercise.subcategory!,
        positionCategory: exercise.positionCategory || [],
        setup: exercise.setup || '',
        description: exercise.description || '',
        uses_tracking: Boolean(exercise.uses_tracking),
        max_is_good: exercise.max_is_good ?? undefined,
        successful_reps: exercise.successful_reps ?? undefined,
        sets: typeof exercise.sets === 'number' ? exercise.sets : 3,
        set_duration: exercise.set_duration ?? (exercise.uses_tracking ? 1 : 30),
        rest: typeof exercise.rest === 'number' ? exercise.rest : 30,
        perFoot: exercise.perFoot ?? false,
        videoUrls: exercise.videoUrls || {},
      };

      addExerciseToWorkout(workoutId, exerciseForWorkout);

      router.replace({
        pathname: '/workouts/[id]',
        params: { id: workoutId },
      });
    } else {
      router.back();
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <Text style={GlobalStyles.title}>
          {titleCase(String(position))}
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 8, color: COLORS.text }}>Loading exercises…</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ExerciseCard
              name={item.name!}
              subcategory={item.subcategory!}
              color={SUBCATEGORY_COLORS[item.subcategory!] ?? COLORS.primary}
              onPress={() => handleAdd(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View style={{ padding: 24 }}>
              <Text style={{ color: COLORS.text }}>
                No exercises found for this position.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
