// app/(tabs)/workouts/[id]/complete.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';

type RecordsMap = Record<string, number>;

export default function WorkoutCompleteScreen() {
  const { id, records } = useLocalSearchParams<{ id: string; records?: string }>();
  const router = useRouter();
  const { workouts } = useWorkout();
  const workout = workouts.find((w) => w.id === id);

  // parse the passed records JSON (or empty map)
  const parsedRecords: RecordsMap = records
    ? JSON.parse(records)
    : {};

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Not Found</Text>
      </View>
    );
  }

  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + (ex.sets || 1),
    0
  );

  // build a list of { id, name, best } for FlatList
  const recordList = workout.exercises
    .filter((ex) => parsedRecords[ex.id] != null)
    .map((ex) => ({
      id: ex.id,
      name: ex.name,
      best: parsedRecords[ex.id],
    }));

  return (
    <View style={styles.container}>
      <Ionicons
        name="trophy"
        size={64}
        color={COLORS.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>Workout Complete</Text>
      <Text style={styles.subtitle}>{workout.name}</Text>

      <View style={styles.metrics}>
        <Text style={styles.metric}>{workout.exercises.length} Exercises</Text>
        <Text style={styles.metric}>{totalSets} Sets</Text>
      </View>

      {recordList.length > 0 && (
        <View style={styles.records}>
          <Text style={styles.recordsTitle}>Your Personal Bests</Text>
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
      )}

      <Pressable
        style={styles.doneBtn}
        onPress={() => router.replace('/')}
      >
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
