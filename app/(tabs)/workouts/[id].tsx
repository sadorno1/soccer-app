// app/workouts/[id].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts } = useWorkout();

  const workout = workouts.find((w) => w.id === id);

  const handleAddExercise = () => {
    router.push({ pathname: '/(tabs)/select-position', params: { target: id } });
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>

      <Pressable style={styles.startButton} disabled>
        <Text style={styles.startText}>Start workout</Text>
      </Pressable>

      <View style={styles.row}>
        <Text style={styles.section}>Exercises</Text>
        <Pressable onPress={handleAddExercise}>
          <Text style={styles.addLink}>Add</Text>
        </Pressable>
      </View>

      {workout.exercises?.length ? (
        <FlatList
          data={workout.exercises}
          keyExtractor={(item, i) => item.name + i}
          renderItem={({ item }) => (
            <Text style={styles.exerciseItem}>{item.name}</Text>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.noText}>No exercises</Text>
          <Text style={styles.subText}>Add exercises to your workout to start working out.</Text>
          <Pressable style={styles.cta} onPress={handleAddExercise}>
            <Text style={styles.ctaText}>Add Exercise</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  startText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  addLink: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  noText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  cta: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  exerciseItem: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 8,
  },
});
