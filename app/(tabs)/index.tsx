// app/index.tsx
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { db } from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import { useRouter } from 'expo-router';
import 'expo-router/entry';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { workouts } = useWorkout();
  const { user } = useAuth();
  
  const [latestRecord, setLatestRecord] = useState<{ name: string; value: number; date: Date } | null>(null);
  const [totalReps, setTotalReps] = useState(0);
  const [exercisesWithRecords, setExercisesWithRecords] = useState(0);
  const [totalExercisesAvailable, setTotalExercisesAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  const lastWorkout = workouts.find((w) => !w.permanent);

  // Load total exercises count from Firestore
  useEffect(() => {
    const loadExercisesCount = async () => {
      try {
        const exercisesSnapshot = await getDocs(collection(db, 'exercises'));
        setTotalExercisesAvailable(exercisesSnapshot.size);
      } catch (error) {
        console.error('Error loading exercises count:', error);
        // Fallback to 0 if there's an error
        setTotalExercisesAvailable(0);
      }
    };

    loadExercisesCount();
  }, []);

  // Load personal records from Firebase
  useEffect(() => {
    if (!user) return;

    const userRecordsRef = doc(db, 'workoutSessions', user.uid);
    
    const unsubscribe = onSnapshot(userRecordsRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        if (data.records && data.exercises) {
          // Find the most recent record
          let mostRecentRecord = null;
          let mostRecentDate = new Date(0); 
          let totalRepsSum = 0;
          
          Object.entries(data.records).forEach(([exerciseId, recordData]) => {
            const exercise = data.exercises.find((e: any) => e.id === exerciseId);
            
            if (exercise) {
              let recordDate: Date;
              let value: number;
              
              if (typeof recordData === 'number') {
                // Old format
                value = recordData;
                recordDate = data.timestamp?.toDate() || new Date();
              } else if (recordData && typeof recordData === 'object' && 'value' in recordData) {
                // New format
                value = (recordData as any).value;
                recordDate = (recordData as any).timestamp?.toDate() || new Date();
              } else {
                return;
              }
              
              // Add to total reps
              totalRepsSum += value;
              
              if (recordDate > mostRecentDate) {
                mostRecentDate = recordDate;
                mostRecentRecord = {
                  name: exercise.name,
                  value: value,
                  date: recordDate
                };
              }
            }
          });
          
          setLatestRecord(mostRecentRecord);
          setTotalReps(totalRepsSum);
          setExercisesWithRecords(Object.keys(data.records).length);
        } else {
          setLatestRecord(null);
          setTotalReps(0);
          setExercisesWithRecords(0);
        }
      } else {
        setLatestRecord(null);
        setTotalReps(0);
        setExercisesWithRecords(0);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <View style={GlobalStyles.container}>
      {/* Static Header Section */}
      <Text style={GlobalStyles.header}>Home</Text>

      <Pressable
        style={({ pressed }) => [
          GlobalStyles.startButton,
          pressed && styles.startButtonPressed
        ]}
        onPress={() => router.push('/my-workouts')}
      >
        <Text style={GlobalStyles.buttonText}>Start Workout</Text>
      </Pressable>

      {/* Scrollable Content Below */}
      <ScrollView 
        style={styles.scrollableContent} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

      <Text style={GlobalStyles.sectionTitle}>Last Workout</Text>
      <Pressable 
        style={GlobalStyles.card}
        onPress={() => router.push('/my-workouts')}
      >
        <Text style={GlobalStyles.cardTitle}>
          {lastWorkout ? lastWorkout.name : 'No recent workout'}
        </Text>
      </Pressable>

      <Text style={GlobalStyles.sectionTitle}>Latest Personal Record</Text>
      <Pressable 
        style={GlobalStyles.card}
        onPress={() => router.push('/records')}
      >
        <Text style={GlobalStyles.cardTitle}>
          {loading ? 'Loading...' : latestRecord ? latestRecord.name : 'No records yet'}
        </Text>
        
      </Pressable>

      <View style={[GlobalStyles.statsRow, styles.statsRowAdjusted]}>
        <View style={GlobalStyles.statBlock}>
          <Text style={GlobalStyles.statLabel}>REPS</Text>
          <Text style={[GlobalStyles.statValue, styles.recordStatValue]}>
            {loading ? '...' : latestRecord ? latestRecord.value : '--'}
          </Text>
        </View>
        <View style={GlobalStyles.statBlock}>
          <Text style={GlobalStyles.statLabel}>DATE</Text>
          <Text style={[GlobalStyles.statValue, styles.dateStatValue]}>
            {loading ? '...' : latestRecord ? latestRecord.date.toLocaleDateString() : '--'}
          </Text>
        </View>
      </View>

      <Text style={GlobalStyles.sectionTitle}>Total Stats</Text>
      <Pressable 
        style={GlobalStyles.card}
        onPress={() => router.push('/records')}
      >
        <View style={styles.progressSection}>
          <View style={styles.pieChartContainer}>
            {loading ? (
              <View style={styles.pieChartPlaceholder}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <View>
                <Svg width={screenWidth * 0.35} height={screenWidth * 0.35} viewBox="0 0 140 140">
                  <Defs>
                    {/* Gradient for the progress ring */}
                    <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                      <Stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#93C5FD" stopOpacity="1" />
                    </LinearGradient>
                    
                    {/* Shadow gradient */}
                    <LinearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" stopOpacity="1" />
                      <Stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  
                  <G>
                    {/* Outer shadow/glow effect */}
                    <Circle
                      cx="70"
                      cy="70"
                      r="62"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.1)"
                      strokeWidth="4"
                    />
                    
                    {/* Background ring */}
                    <Circle
                      cx="70"
                      cy="70"
                      r="55"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    
                    {/* Progress ring with gradient */}
                    {exercisesWithRecords > 0 && (
                      <Circle
                        cx="70"
                        cy="70"
                        r="55"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(exercisesWithRecords / totalExercisesAvailable) * 345} 345`}
                        strokeDashoffset="0"
                        transform="rotate(-90 70 70)"
                      />
                    )}
                    
                    {/* Inner highlight ring */}
                    <Circle
                      cx="70"
                      cy="70"
                      r="40"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                    />
                    
                    {/* Center content */}
                    <G>
                      {/* Fraction text */}
                      <SvgText
                        x="70"
                        y="58"
                        textAnchor="middle"
                        fontSize="20"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        {`${exercisesWithRecords}/${totalExercisesAvailable}`}
                      </SvgText>
                      
                      {/* Exercises text */}
                      <SvgText
                        x="70"
                        y="74"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        fill="rgba(255, 255, 255, 0.7)"
                      >
                        EXERCISES
                      </SvgText>
                      
                      {/* Percentage text smaller */}
                      <SvgText
                        x="70"
                        y="86"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill={COLORS.accent}
                      >
                        {Math.round((exercisesWithRecords / totalExercisesAvailable) * 100)}%
                      </SvgText>
                    </G>
                  </G>
                </Svg>
                
           
              </View>
            )}
          </View>
        </View>

        <View style={styles.totalRepsSection}>
          <Text style={styles.totalRepsLabel}>Total Reps Achieved</Text>
          <Text style={styles.totalRepsValue}>
            {loading ? '...' : totalReps.toLocaleString()}
          </Text>
        </View>
      </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  startButtonPressed: {
    backgroundColor: COLORS.accent + 'DD', 
    transform: [{ scale: 0.98 }], 
  },
  
  scrollableContent: {
    flex: 1,
    marginTop: 16,
  },
  
  statsRowAdjusted: {
    justifyContent: 'flex-start',
    paddingHorizontal: '8%',
    gap: screenWidth * 0.12, 
  },
  
  recordStatValue: {
    fontSize: screenWidth * 0.06, 
    fontWeight: '600',
    color: COLORS.accent,
  },
  dateStatValue: {
    fontSize: screenWidth * 0.06, 
    fontWeight: '600',
    color: COLORS.accent,
  },
  
  // Progress section styles
  progressSection: {
    marginBottom: screenHeight * 0.012, 
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: screenWidth * 0.04, 
    fontWeight: '600',
    color: COLORS.text,
  },
  progressText: {
    fontSize: screenWidth * 0.04,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressSubtext: {
    fontSize: screenWidth * 0.03, 
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: screenHeight * 0.007, 
    fontStyle: 'italic',
  },
  
  // Pie chart styles
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: screenHeight * 0.012, 
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: screenWidth * 0.2, 
    padding: screenWidth * 0.02, 
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pieChartPlaceholder: {
    width: screenWidth * 0.35, 
    height: screenWidth * 0.35, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: screenWidth * 0.175, 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingText: {
    fontSize: screenWidth * 0.035, 
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  totalRepsSection: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: screenHeight * 0.018, 
  },
  totalRepsLabel: {
    fontSize: screenWidth * 0.032, 
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: screenHeight * 0.007, 
    letterSpacing: 1,
  },
  totalRepsValue: {
    fontSize: screenWidth * 0.08, 
    fontWeight: '800',
    color: COLORS.primary,
    textShadowColor: 'rgba(37, 99, 235, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

