// app/(tabs)/records.tsx
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Theme, { GlobalStyles } from '@/theme';

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

  /* ---------------- Firestore listener ---------------- */
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
                workoutName: data.workoutName || 'Unknown Workout',
              };

              if (
                !recordsMap[exerciseId] ||
                recordDate > recordsMap[exerciseId].date
              ) {
                recordsMap[exerciseId] = newRecord;
              }
            }
          });
        }
      });

      const sortedRecords = Object.values(recordsMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setLatestRecords(sortedRecords);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  /* ---------------- UI states ---------------- */
  if (loading) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (latestRecords.length === 0) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center' }]}>
        <Text style={GlobalStyles.noText}>No exercise records yet</Text>
      </View>
    );
  }

  /* ---------------- Normal render ---------------- */
  return (
    <View style={GlobalStyles.container}>
          <View style={GlobalStyles.headerRow}>
              <Text style={GlobalStyles.header}>
              My Records
            </Text>
            </View>
      <FlatList
        data={latestRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View
            style={[
              GlobalStyles.card,
              { flexDirection: 'column', alignItems: 'flex-start' },
            ]}
          >
            <Text style={GlobalStyles.cardTitle}>{item.name}</Text>

            <Text style={[GlobalStyles.paragraph, { fontWeight: '600' }]}>
              {item.maxReps} reps (Latest)
            </Text>

            <Text style={GlobalStyles.cardSubtitle}>{item.workoutName}</Text>

            <Text style={GlobalStyles.cardSubtitle}>
              {item.date.toLocaleDateString()} ·{' '}
              {item.date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
