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
      tag: name,  // or blank string if you prefer
      color: TAG_COLORS[workouts.length % TAG_COLORS.length],
      // NO `days` here
    });

    setNewWorkoutName('');
    setModalVisible(false);
  };

  const renderRightActions = (item: any) =>
    item.permanent ? null : (
      <Pressable
        onPress={() => deleteWorkout(item.id)}
        style={styles.deleteBox}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );

  const renderWorkoutCard = ({ item }: { item: any }) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
    >
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({ pathname: '/workouts/[id]', params: { id: item.id } })
        }
      >
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            {item.exercises.length} exercises
          </Text>
        </View>
        <View style={[styles.tagCircle, { backgroundColor: item.color }]}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.title}>My Workouts</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.addText}>Add</Text>
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
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Workout</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Workout name"
                  placeholderTextColor={COLORS.textMuted}
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelBtn}
                  >
                    <Text style={styles.cancelText}>CANCEL</Text>
                  </Pressable>
                  <Pressable onPress={handleAddWorkout} style={styles.addBtn}>
                    <Text style={styles.addTextBtn}>ADD</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  addText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLeft: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  tagCircle: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteBox: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 16,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  addBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  addTextBtn: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
});
