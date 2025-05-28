// app/exercises/[position].tsx

import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sampleExercises } from '@/data/sampleExercises';
import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';

export default function PositionExerciseScreen() {
  const { position } = useLocalSearchParams();
  const router = useRouter();

  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

  const filtered = sampleExercises.filter(
    (ex) => position === 'all' || normalize(ex.positionCategory) === position
  );

  const handleAdd = (exerciseName: string) => {
    console.log('Added to Quick Workout:', exerciseName);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{(position as string)?.replaceAll('-', ' ').toUpperCase()}</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ExerciseCard
            name={item.name}
            subcategory={item.subcategory}
            onPress={() => handleAdd(item.name)}
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
  },
});
