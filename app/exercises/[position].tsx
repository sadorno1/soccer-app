import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { sampleExercises } from '@/data/sampleExercises';
import { GlobalStyles } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

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
  if (workoutId) {
    // Ensure tracking exercises have at least a minimal set_duration to prevent crashes
    const exerciseWithDefaults = {
      ...exercise,
      set_duration: exercise.set_duration ?? (exercise.uses_tracking ? 1 : 0),
    };
    
    addExerciseToWorkout(workoutId, exerciseWithDefaults);

    router.replace({
      pathname: '/workouts/[id]',
      params: { id: workoutId },   // supply the id
    });
  } else {
    router.back();
  }
};


  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <Text style={GlobalStyles.title}>
        {titleCase(position)}
      </Text>
        </View>


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
