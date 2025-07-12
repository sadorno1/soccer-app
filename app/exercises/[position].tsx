import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { sampleExercises } from '@/data/sampleExercises';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

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

export default function PositionExerciseScreen() {
  const { position, workoutId } = useLocalSearchParams<{
    position: string;
    workoutId?: string;
  }>();
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkout();

  /* ---------- filter ---------- */
  const filtered = sampleExercises.filter((ex) =>
    ex.positionCategory.map(normalize).includes(position)
  );

  /* ---------- sort: subcategory → name ---------- */
  const sorted = [...filtered].sort((a, b) => {
    if (a.subcategory !== b.subcategory) {
      return a.subcategory.localeCompare(b.subcategory);
    }
    return a.name.localeCompare(b.name);
  });

  /* ---------- when user taps an exercise ---------- */
const handleAdd = (exercise: typeof sampleExercises[number]) => {
  if (workoutId) addExerciseToWorkout(workoutId, exercise);

  // Jump straight back to the select-position screen instead of Home
  router.replace({
    pathname: '/workouts/[id]',
    params: { id: workoutId },   // pass the workout ID back along
  });
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {position.replaceAll('-', ' ').toUpperCase()}
      </Text>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ExerciseCard
            name={item.name}
            subcategory={item.subcategory}
            color={SUBCATEGORY_COLORS[item.subcategory] ?? COLORS.primary}
            onPress={() => handleAdd(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 20,

  },
});
