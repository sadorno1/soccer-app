// app/(tabs)/records.tsx
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

interface ExerciseRecord {
  id: string;
  name: string;
  maxReps: number;
  date: Date;
}

export default function Records() {
  const { user } = useAuth();
  const [latestRecords, setLatestRecords] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Firestore listener ---------------- */
  useEffect(() => {
    if (!user) return;

    // Listen to the single global record document for this user
    const userRecordsRef = doc(db, 'workoutSessions', user.uid);

    const unsubscribe = onSnapshot(userRecordsRef, (docSnapshot: any) => {
      const recordsMap: Record<string, ExerciseRecord> = {};

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        if (data.records) {
          Object.entries(data.records).forEach(([exerciseId, reps]) => {
            const exercise = data.exercises?.find((e: any) => e.id === exerciseId);
            
            if (exercise) {
              const recordDate = data.timestamp?.toDate() || new Date();
              const exerciseName = exercise.name;
              
              // Group by exercise name, keep the best record
              if (!recordsMap[exerciseName] || (reps as number) > recordsMap[exerciseName].maxReps) {
                recordsMap[exerciseName] = {
                  id: exerciseId,
                  name: exerciseName,
                  maxReps: reps as number,
                  date: recordDate,
                };
              }
            }
          });
        }
      }

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
              {item.maxReps} reps (Personal Best)
            </Text>

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
