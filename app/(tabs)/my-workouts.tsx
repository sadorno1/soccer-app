// app/(tabs)/my-workouts.tsx
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { useState } from 'react';
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

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TAG_COLORS = ['#facc15', '#f97316', '#34d399', '#60a5fa', '#a78bfa', '#f87171'];

export default function MyWorkoutsScreen() {
  const router = useRouter();
  const { workouts, addWorkout, deleteWorkout } = useWorkout();

  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  /* ---------- helpers ---------- */
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddWorkout = () => {
    if (!newWorkoutName.trim()) return;
    const nextColor = TAG_COLORS[workouts.length % TAG_COLORS.length];

    addWorkout({
      id: Date.now().toString(),
      name: newWorkoutName.trim(),
      exercises: [],
      tag: selectedDays[0] || '',
      color: nextColor,
      days: selectedDays,
    });

    setNewWorkoutName('');
    setSelectedDays([]);
    setModalVisible(false);
  };

  /* ---------- swipe action ---------- */
  const renderRightActions = (item: any) =>
    item.permanent ? null : (
      <Pressable
        onPress={() => deleteWorkout(item.id)}
        style={styles.deleteBox}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );

  /* ---------- card ---------- */
  const renderWorkoutCard = (item: any) => (
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
          <Text style={styles.cardSubtitle}>{item.exercises.length} exercises</Text>
        </View>
        <View style={[styles.tagCircle, { backgroundColor: item.color }]}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  /* ---------- render ---------- */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Workouts</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Workout Plans</Text>

      {/* List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderWorkoutCard(item)}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Add-Workout modal (unchanged) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Workout</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Coordination"
                  placeholderTextColor={COLORS.textMuted}
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                />

                <Text style={styles.modalLabel}>Workout days</Text>
                <View style={styles.dayRow}>
                  {WEEK_DAYS.map((day) => (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayBox,
                        selectedDays.includes(day) && styles.daySelected,
                      ]}
                    >
                      <Text style={styles.dayText}>{day}</Text>
                    </Pressable>
                  ))}
                </View>

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

/* ---------- styles ---------- */
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
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  addText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  /* card */
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
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  cardSubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  tagCircle: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { color: '#000', fontWeight: '600', fontSize: 12 },

  /* swipe delete */
  deleteBox: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 16,
    marginBottom: 12,
  },
  deleteText: { color: '#fff', fontWeight: '700' },

  /* modal styles … (unchanged) */
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
  modalLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dayBox: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  daySelected: { backgroundColor: COLORS.primary },
  dayText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
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
  cancelText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  addTextBtn: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
});
