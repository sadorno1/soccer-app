import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

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
      <Pressable style={styles.startButton}
      onPress={() => 
        router.push({
       pathname: '/(tabs)/workouts/[id]/start',
       params: { id },})}>
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
            <ExerciseCard
              name={item.name}
              subcategory={item.subcategory}
              sets={item.sets}
              weight={item.weight}
              color={SUBCATEGORY_COLORS[item.subcategory] ?? COLORS.primary}
            />
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
});
