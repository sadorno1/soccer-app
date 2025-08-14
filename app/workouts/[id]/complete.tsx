// app/(tabs)/workouts/[id]/complete.tsx
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type RecordsMap = Record<string, number>;
type ExSnap = { id: string; name: string; sets: number };

export default function WorkoutCompleteScreen() {
  const { id, records, exercises, hasImprovements, improvedExercises } = useLocalSearchParams<{
    id: string;
    records?: string;
    exercises?: string;
    hasImprovements?: string;
    improvedExercises?: string;
  }>();
  const router = useRouter();
  const { workouts } = useWorkout();
  const workout = workouts.find(w => w.id === id);

  const parsedRecords: RecordsMap = records ? JSON.parse(records) : {};
  const snapshot: ExSnap[] | null = exercises ? JSON.parse(exercises) : null;
  const hadImprovements = hasImprovements === 'true';
  const improvedExerciseIds: string[] = improvedExercises ? JSON.parse(improvedExercises) : [];

  /* ---------- metrics ---------- */
  const exerciseCount = snapshot
    ? snapshot.length
    : workout?.exercises.length ?? 0;

  const totalSets = snapshot
    ? snapshot.reduce((s, ex) => s + ex.sets, 0)
    : workout
        ? workout.exercises.reduce((s, ex) => s + (ex.sets || 1), 0)
        : 0;

  const recordList = (snapshot ?? workout?.exercises ?? [])
    .filter(ex => improvedExerciseIds.includes(ex.id) && parsedRecords[ex.id] != null)
    .map(ex => ({
      id: ex.id,
      name: ex.name,
      best: parsedRecords[ex.id],
    }));

  if (!workout && !snapshot) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Not Found</Text>
      </View>
    );
  }

  /* ---------- UI ---------- */
  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={64} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.title}>Workout Complete</Text>
      <Text style={styles.subtitle}>{workout?.name ?? 'Quick Workout'}</Text>

      <View style={styles.metrics}>
        <Text style={styles.metric}>{exerciseCount} Exercises</Text>
        <Text style={styles.metric}>{totalSets} Sets</Text>
      </View>

      {recordList.length > 0 ? (
        <View style={styles.records}>
          <Text style={styles.recordsTitle}>New Personal Bests!</Text>
          <FlatList
            data={recordList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordRow}>
                <Text style={styles.recordName}>{item.name}</Text>
                <Text style={styles.recordValue}>{item.best} reps</Text>
              </View>
            )}
          />
        </View>
      ) : hadImprovements ? (
        <View style={styles.records}>
          <Text style={styles.recordsTitle}>Great workout!</Text>
          <Text style={styles.noRecordsText}>You did great, keep pushing!</Text>
        </View>
      ) : (
        <View style={styles.records}>
          <Text style={styles.recordsTitle}>Good effort!</Text>
          <Text style={styles.noRecordsText}>No new personal bests this time, but every workout counts!</Text>
        </View>
      )}

      <Pressable style={styles.doneBtn} onPress={() => router.replace('/')}>
        <Text style={styles.doneText}>Return Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  metrics: {
    marginBottom: 32,
    alignItems: 'center',
  },
  metric: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 4,
  },
  records: {
    width: '100%',
    marginBottom: 32,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recordName: {
    fontSize: 16,
    color: COLORS.text,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noRecordsText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  doneText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: 16,
  },
});
