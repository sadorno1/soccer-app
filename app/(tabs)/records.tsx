// app/(tabs)/records.tsx
import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface ExerciseRecord {
  id: string;
  name: string;
  maxReps: number;
  date: Date;
  workoutName: string;
}

export default function Records() {
  const { user } = useAuth();
  const [latestRecords, setLatestRecords] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'workoutSessions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsMap: Record<string, ExerciseRecord> = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.records) {
          Object.entries(data.records).forEach(([exerciseId, reps]) => {
            const exercise = data.exercises?.find((e: any) => e.id === exerciseId);
            if (exercise) {
              const recordDate = data.timestamp?.toDate() || new Date();
              const newRecord = {
                id: exerciseId,
                name: exercise.name,
                maxReps: reps as number,
                date: recordDate,
                workoutName: data.workoutName || 'Unknown Workout'
              };

              // Only keep the most recent record for each exercise
              if (!recordsMap[exerciseId] || recordDate > recordsMap[exerciseId].date) {
                recordsMap[exerciseId] = newRecord;
              }
            }
          });
        }
      });

      // Convert to array and sort by exercise name
      const sortedRecords = Object.values(recordsMap).sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      setLatestRecords(sortedRecords);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (latestRecords.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRecordsText}>No exercise records yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={latestRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.recordItem}>
              <Text style={styles.recordReps}>{item.maxReps} reps (Latest)</Text>
              <Text style={styles.recordWorkout}>{item.workoutName}</Text>
              <Text style={styles.recordDate}>
                {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ... (keep your existing styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  exerciseContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordItem: {
    marginTop: 8,
  },
  recordReps: {
    fontSize: 16,
  },
  recordWorkout: {
    fontSize: 14,
    color: '#666',
  },
  recordDate: {
    fontSize: 12,
    color: '#999',
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#999',
  },
});