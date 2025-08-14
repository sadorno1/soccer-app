// app/(tabs)/records.tsx
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface ExerciseRecord {
  id: string;
  name: string;
  maxReps: number;
  date: Date;
  max_is_good?: boolean;
  recordType?: 'personal-best' | 'lower-is-better';
}

export default function Records() {
  const { user } = useAuth();
  const [latestRecords, setLatestRecords] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to the single global record document for this user
    const userRecordsRef = doc(db, 'workoutSessions', user.uid);

    const unsubscribe = onSnapshot(userRecordsRef, (docSnapshot: any) => {
      const recordsMap: Record<string, ExerciseRecord> = {};

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        if (data.records) {
          Object.entries(data.records).forEach(([exerciseId, recordData]) => {
            const exercise = data.exercises?.find((e: any) => e.id === exerciseId);
            
            if (exercise) {
              let reps: number;
              let recordDate: Date;
              
              if (typeof recordData === 'number') {
                reps = recordData;
                recordDate = data.timestamp?.toDate() || new Date();
              } else if (recordData && typeof recordData === 'object' && 'value' in recordData) {
                reps = (recordData as any).value;
                recordDate = (recordData as any).timestamp?.toDate() || new Date();
              } else {
                return; 
              }
              
              const exerciseName = exercise.name;
              const maxIsGood = exercise.max_is_good !== false; 
              
              // Group by exercise name, keep the best record
              if (!recordsMap[exerciseName] || 
                  (maxIsGood && reps > recordsMap[exerciseName].maxReps) ||
                  (!maxIsGood && reps < recordsMap[exerciseName].maxReps)) {
                recordsMap[exerciseName] = {
                  id: exerciseId,
                  name: exerciseName,
                  maxReps: reps,
                  date: recordDate,
                  max_is_good: maxIsGood,
                  recordType: maxIsGood ? 'personal-best' : 'lower-is-better',
                };
              }
            }
          });
        }
      }

      const sortedRecords = Object.values(recordsMap).sort((a, b) =>
        b.date.getTime() - a.date.getTime() 
      );

      setLatestRecords(sortedRecords);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (latestRecords.length === 0) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="trophy-outline" size={64} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
        <Text style={[GlobalStyles.noText, { textAlign: 'center', marginBottom: 8 }]}>
          No personal records yet
        </Text>
        <Text style={[GlobalStyles.paragraph, { textAlign: 'center', color: COLORS.textMuted }]}>
          Complete some workouts to see your achievements here!
        </Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <View style={styles.headerContent}>
          <Text style={GlobalStyles.header}>My Records</Text>
        </View>
       
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
              item.recordType === 'lower-is-better' ? styles.lowerIsBetterCard : styles.higherIsBetterCard
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={GlobalStyles.cardTitle}>{item.name}</Text>
            </View>

            <View style={styles.recordValue}>
              <Text style={[GlobalStyles.paragraph, { fontWeight: '700', fontSize: 24, color: COLORS.primary }]}>
                {item.maxReps}
              </Text>
              <Text style={[GlobalStyles.paragraph, { fontWeight: '600', marginLeft: 8 }]}>
                {item.recordType === 'lower-is-better' ? 
                  (item.maxReps === 1 ? 'attempt' : 'attempts') : 
                  (item.maxReps === 1 ? 'rep' : 'reps')
                }
              </Text>
              <View style={[
                styles.crownContainer,
                item.recordType === 'lower-is-better' ? styles.lowerBadgeContainer : styles.higherBadgeContainer
              ]}>
                <Ionicons 
                  name={item.recordType === 'lower-is-better' ? 'trending-down' : 'trending-up'} 
                  size={16} 
                  color="white" 
                />
                <Text style={styles.personalBestText}>
                  {item.recordType === 'lower-is-better' ? 'Lower is Better' : 'Higher is Better'}
                </Text>
              </View>
            </View>

            <Text style={[GlobalStyles.cardSubtitle, { marginTop: 8 }]}>
              Achieved on {item.date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
              })} at {item.date.toLocaleTimeString([], {
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

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  higherBadge: {
    backgroundColor: COLORS.success,
  },
  lowerBadge: {
    backgroundColor: COLORS.warning,
  },
  higherIsBetterCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  lowerIsBetterCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  recordValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  crownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  higherBadgeContainer: {
    backgroundColor: COLORS.success,
  },
  lowerBadgeContainer: {
    backgroundColor: COLORS.warning,
  },
  personalBestText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    marginLeft: 4,
  },
});
