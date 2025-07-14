import ExerciseCard from '@/components/ExerciseCard'
import { COLORS } from '@/constants/Colors'
import { useWorkout } from '@/context/WorkoutContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import Theme, { SIZES, scale, verticalScale, GlobalStyles } from '@/theme';
import { StackActions } from '@react-navigation/native';



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
  const [modalVisible, setModalVisible] = useState(false);
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
    router.replace({ pathname: '/select-position', params: { target: id } })

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
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <Pressable onPress={() => router.back()}
                            style={({ pressed }) => [
                    GlobalStyles.add_back_Button,
                    { 
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      shadowOpacity: pressed ? 0.3 : 0.2,
                    }
                  ]}
                >
                  <Text style={GlobalStyles.add_backText}>{'←'}</Text>
                </Pressable>
                
        <Text style={GlobalStyles.title}>{workout.name}</Text>
    <Pressable 
  onPress={() => {
    setModalVisible(true);
    handleAdd();
  }}
  disabled={isActive}
  style={({ pressed }) => [
    GlobalStyles.add_back_Button,
    { 
      opacity: isActive ? 0.5 : 1, // Only change opacity when disabled
      transform: isActive ? [] : [{ scale: pressed ? 0.95 : 1 }], // No transform when disabled
      // Remove shadow effects when disabled
      elevation: isActive ? 0 : 2,
      shadowOpacity: isActive ? 0 : 0.2,
    }
  ]}
>
  <Text style={[
    GlobalStyles.add_backText,
    { opacity: isActive ? 0.5 : 1 } // Ensure text also respects disabled state
  ]}>+</Text>
</Pressable>
      </View>

      {isActive && (
        <View style={GlobalStyles.banner}>
          <Text style={GlobalStyles.bannerText}>WORKOUT IN PROGRESS</Text>
        </View>
      )}

      <Pressable
        style={[
          GlobalStyles.startBtn,
          hasExercises ? GlobalStyles.startEnabled : GlobalStyles.startDisabled,
          isActive && GlobalStyles.startActive,
        ]}
        onPress={handleStart}
        disabled={!hasExercises || isActive}
      >
        <Text style={GlobalStyles.startText}>
          {isActive ? 'Continue Workout' : 'Start Workout'}
        </Text>
      </Pressable>

      <View style={GlobalStyles.row}>
        <Text style={GlobalStyles.section}>Exercises</Text>
      
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
                  style={GlobalStyles.deleteBox}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={GlobalStyles.deleteText}>Delete</Text>
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
        <View style={GlobalStyles.empty}>
          <Text style={GlobalStyles.noText}>No exercises</Text>
          <Text style={GlobalStyles.subText}>
            Add exercises to your workout to start.
          </Text>
          <Pressable
            style={GlobalStyles.cta}
            onPress={handleAdd}
            disabled={isActive}
          >
            <Text style={GlobalStyles.ctaText}>Add Exercise</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

