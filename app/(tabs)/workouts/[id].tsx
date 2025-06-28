// app/(tabs)/workouts/[id].tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkout } from '@/context/WorkoutContext';
import { Swipeable } from 'react-native-gesture-handler';
import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';

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
  const {
    workouts,
    deleteExerciseFromWorkout,
    activeWorkoutId,
    clearActiveWorkout,
    setActiveWorkout,
  } = useWorkout();

  // Find the workout by ID
  const workout = workouts.find(w => w.id === id);

  // If it's ever removed (e.g. deleted), send the user back to the list
  useEffect(() => {
    if (!workout) {
      router.replace('/my-workouts');
    }
  }, [workout]);

  // Don't render anything until guard runs
  if (!workout) return null;

  const isActive = activeWorkoutId === id;
  const hasExercises = workout.exercises.length > 0;

  const handleAddExercise = () => {
    router.push({
      pathname: '/(tabs)/select-position',
      params: { target: id },
    });
  };

  const handleStartWorkout = () => {
    if (!hasExercises) return;
    setActiveWorkout(id); // mark this workout "in progress"
    router.replace({
      pathname: '/workouts/[id]/start',
      params: { id },
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (isActive) clearActiveWorkout();
    deleteExerciseFromWorkout(id, exerciseId);
  };

  const renderRightActions = (exerciseId: string) => (
    <Pressable
      onPress={() => handleDeleteExercise(exerciseId)}
      style={styles.deleteBox}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Active banner */}
      {isActive && (
        <View style={styles.activeWorkoutBanner}>
          <Text style={styles.activeWorkoutText}>WORKOUT IN PROGRESS</Text>
        </View>
      )}

      {/* Start / Continue button */}
      <Pressable
        style={[
          styles.startButtonBase,
          hasExercises ? styles.startEnabled : styles.startDisabled,
          isActive && styles.activeWorkoutButton,
        ]}
        onPress={handleStartWorkout}
        disabled={!hasExercises || isActive}
      >
        <Text
          style={[
            styles.startTextBase,
            hasExercises
              ? styles.startTextEnabled
              : styles.startTextDisabled,
          ]}
        >
          {isActive ? 'Continue Workout' : 'Start Workout'}
        </Text>
      </Pressable>

      {/* Exercises header */}
      <View style={styles.row}>
        <Text style={styles.section}>Exercises</Text>
        <Pressable onPress={handleAddExercise} disabled={isActive}>
          <Text
            style={[
              styles.addLink,
              isActive && styles.disabledAddLink,
            ]}
          >
            Add
          </Text>
        </Pressable>
      </View>

      {/* Exercise list or empty state */}
      {hasExercises ? (
        <FlatList
          data={workout.exercises}
          keyExtractor={item => `${workout.id}-${item.id}`}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() =>
                !isActive && renderRightActions(item.id)
              }
              overshootRight={false}
              enabled={!isActive}
            >
              <ExerciseCard
                name={item.name}
                subcategory={item.subcategory}
                sets={item.sets}
                weight={item.weight}
                color={
                  SUBCATEGORY_COLORS[item.subcategory] ??
                  COLORS.primary
                }
              />
            </Swipeable>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.noText}>No exercises</Text>
          <Text style={styles.subText}>
            Add exercises to your workout to start working out.
          </Text>
          <Pressable
            style={styles.cta}
            onPress={handleAddExercise}
            disabled={isActive}
          >
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  activeWorkoutBanner: {
    backgroundColor: COLORS.warning,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  activeWorkoutText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  startButtonBase: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  startEnabled: { backgroundColor: COLORS.primary },
  startDisabled: { backgroundColor: COLORS.surface, opacity: 0.6 },
  activeWorkoutButton: { backgroundColor: COLORS.warning },
  startTextBase: { fontWeight: '600', fontSize: 16 },
  startTextEnabled: { color: COLORS.background },
  startTextDisabled: { color: COLORS.textMuted },
  section: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  addLink: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  disabledAddLink: { opacity: 0.5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteBox: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 40 },
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
    color: COLORS.background,
    fontWeight: '600',
    fontSize: 14,
  },
});
