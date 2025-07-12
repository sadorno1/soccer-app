import ExerciseCard from '@/components/ExerciseCard'
import { COLORS } from '@/constants/Colors'
import { useWorkout } from '@/context/WorkoutContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'


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
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const {
    workouts,
    setActiveWorkout,
    deleteExerciseFromWorkout,
    activeWorkoutId,
    clearActiveWorkout,
  } = useWorkout()

  // find the current workout
  const workout = workouts.find(w => w.id === id)
  useEffect(() => {
    if (!workout) router.replace('/my-workouts')
  }, [workout, router])
  if (!workout) return null

  const isActive = activeWorkoutId === id
  const [hasExercises, setHasExercises] = useState(
    workout.exercises.length > 0,
  );

  useEffect(() => {
    setHasExercises(workout.exercises.length > 0);
  }, [workout.exercises]);

  // navigate to add-exercise flow
  const handleAdd = () =>
    router.push({ pathname: '/select-position', params: { target: id } })

  // start or continue the workout session
  const handleStart = () => {
    if (!hasExercises) return
    setActiveWorkout(id)
    router.replace({ pathname: '/workouts/[id]/start', params: { id } })
  }

  // delete an exercise, clearing session if active
  const handleDelete = (exId: string) => {
    console.log("Delete item 1")
    if (isActive) {
          console.log("Delete item 2")

      clearActiveWorkout()
          console.log("Delete item 3")

    } // not implemented
    deleteExerciseFromWorkout(id, exId)
    console.log("Delete item 4")
    setHasExercises(workout.exercises.length - 1 > 0);
    // if workout length is 0, 
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      {isActive && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>WORKOUT IN PROGRESS</Text>
        </View>
      )}

      <Pressable
        style={[
          styles.startBtn,
          hasExercises ? styles.startEnabled : styles.startDisabled,
          isActive && styles.startActive,
        ]}
        onPress={handleStart}
        disabled={!hasExercises || isActive}
      >
        <Text style={styles.startText}>
          {isActive ? 'Continue Workout' : 'Start Workout'}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Text style={styles.section}>Exercises</Text>
        <Pressable onPress={handleAdd} disabled={isActive}>
          <Text style={[styles.addLink, isActive && styles.addDisabled]}>
            Add
          </Text>
        </Pressable>
      </View>

      {hasExercises ? (
        <FlatList
          data={workout.exercises}
          keyExtractor={ex => `${id}-${ex.id}`}
          renderItem={({ item }) => (
            <Swipeable
              enabled={!isActive}
              overshootRight={false}
              renderRightActions={() => (
                <Pressable
                  style={styles.deleteBox}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              )}
            >
              <ExerciseCard
                name={item.name}
                subcategory={item.subcategory}
                sets={item.sets}
                color={
                  SUBCATEGORY_COLORS[item.subcategory] ?? COLORS.primary
                }
              />
            </Swipeable>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.noText}>No exercises</Text>
          <Text style={styles.subText}>
            Add exercises to your workout to start.
          </Text>
          <Pressable
            style={styles.cta}
            onPress={handleAdd}
            disabled={isActive}
          >
            <Text style={styles.ctaText}>Add Exercise</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
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
    marginVertical: 20,
  },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  banner: {
    backgroundColor: COLORS.warning,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  bannerText: { color: 'white', fontWeight: '700', fontSize: 12 },
  startBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  startEnabled: { backgroundColor: COLORS.primary },
  startDisabled: { backgroundColor: COLORS.surface, opacity: 0.6 },
  startActive: { backgroundColor: COLORS.warning },
  startText: { fontWeight: '600', fontSize: 16, color: COLORS.background },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  section: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  addLink: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  addDisabled: { opacity: 0.5 },
  deleteBox: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
  },
  deleteText: { color: 'white', fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 40 },
  noText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  subText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  cta: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  ctaText: { color: COLORS.background, fontWeight: '600' },
})
