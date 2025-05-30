// app/(tabs)/workouts/[id]/complete.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';

export default function WorkoutCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts } = useWorkout();
  const workout = workouts.find((w) => w.id === id);

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

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏆</Text>
      <Text style={styles.title}>Workout Complete</Text>
      <Text style={styles.subtitle}>{workout.name}</Text>

      <View style={styles.metrics}>
        <Text style={styles.metric}>{workout.exercises.length} Exercises</Text>
        <Text style={styles.metric}>{totalSets} Sets</Text>
      </View>

      {/* Optional record summary could go here */}

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
    fontSize: 48,
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
  },
  metric: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 4,
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
