// app/(tabs)/my-workouts.tsx

import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Theme, { SIZES, scale, verticalScale, GlobalStyles } from '@/theme';


const TAG_COLORS = ['#facc15', '#f97316', '#34d399', '#60a5fa', '#a78bfa', '#f87171'];

export default function MyWorkoutsScreen() {
  const router = useRouter();
  const { workouts, addWorkout, deleteWorkout } = useWorkout();

  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  const handleAddWorkout = () => {
    const name = newWorkoutName.trim();
    if (!name) return;

    addWorkout({
      name,
      exercises: [],
      tag: name,  
      color: TAG_COLORS[workouts.length % TAG_COLORS.length],
    });

    setNewWorkoutName('');
    setModalVisible(false);
  };

  const renderRightActions = (item: any) =>
    item.permanent ? null : (
      <Pressable
        onPress={() => deleteWorkout(item.id)}
        style={GlobalStyles.deleteBox}
      >
        <Text style={GlobalStyles.deleteText}>Delete</Text>
      </Pressable>
    );

  const renderWorkoutCard = ({ item }: { item: any }) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
    >
      <Pressable
        style={GlobalStyles.card}
        onPress={() =>
          router.navigate({ pathname: '/workouts/[id]', params: { id: item.id } })
        }
      >
        <View style={GlobalStyles.cardLeft}>
          <Text style={GlobalStyles.cardTitle}>{item.name}</Text>
          <Text style={GlobalStyles.cardSubtitle}>
            {item.exercises.length} exercises
          </Text>
        </View>
        <View style={[GlobalStyles.tagCircle, { backgroundColor: item.color }]}>
          <Text style={GlobalStyles.tagText}>{item.tag}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header Row */}
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
        
        <Text style={GlobalStyles.title}>My Workouts</Text>
       
        <Pressable 
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            GlobalStyles.add_back_Button,
            { 
              transform: [{ scale: pressed ? 0.95 : 1 }],
              shadowOpacity: pressed ? 0.3 : 0.2,
            }
          ]}
        >
          <Text style={GlobalStyles.add_backText}>+</Text>
        </Pressable>
      </View>

      {/* Workout List */}
      <FlatList
        data={workouts}
        keyExtractor={(w) => w.id}
        renderItem={renderWorkoutCard}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Add-Workout Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={GlobalStyles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={GlobalStyles.modalContent}>
                <Text style={GlobalStyles.modalTitle}>Add Workout</Text>
                <TextInput
                  style={GlobalStyles.input}
                  placeholder="Workout name"
                  placeholderTextColor={COLORS.textMuted}
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                />

                <View style={GlobalStyles.modalButtons}>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={GlobalStyles.cancelBtn}
                  >
                    <Text style={GlobalStyles.cancelText}>CANCEL</Text>
                  </Pressable>
                  <Pressable onPress={handleAddWorkout} style={GlobalStyles.addBtn}>
                    <Text style={GlobalStyles.addTextBtn}>ADD</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

