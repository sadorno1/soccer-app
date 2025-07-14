// app/index.tsx

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useWorkout } from '@/context/WorkoutContext';
import Theme, { SIZES, scale, verticalScale, GlobalStyles } from '@/theme';

import 'expo-router/entry';

export default function HomeScreen() {
  const router = useRouter();
  const { workouts } = useWorkout(); 

  const upcomingWorkout = workouts.find((w) => !w.permanent);

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Home</Text>

      <Pressable
        style={GlobalStyles.startButton}
        onPress={() => router.push('/my-workouts')}
      >
        <Text style={GlobalStyles.buttonText}>Start Workout</Text>
      </Pressable>

      <Text style={GlobalStyles.sectionTitle}>Upcoming Workout</Text>
      <View style={GlobalStyles.card}>
        <Text style={GlobalStyles.cardTitle}>
          {upcomingWorkout ? upcomingWorkout.name : 'No upcoming workout'}
        </Text>
        <Text style={GlobalStyles.cardSubtitle}>Today 9:00 AM</Text>
      </View>

      <Text style={GlobalStyles.sectionTitle}>Quick Stats</Text>
      <View style={GlobalStyles.card}>
        <Text style={GlobalStyles.statLabel}>PERSONAL RECORD</Text>
        <Text style={GlobalStyles.statValue}>2 touch</Text>
      </View>

      <View style={GlobalStyles.statsRow}>
        <View style={GlobalStyles.statBlock}>
          <Text style={GlobalStyles.statLabel}>PERSONAL RECORD</Text>
          <Text style={GlobalStyles.statValue}>2:30</Text>
        </View>
        <View style={GlobalStyles.statBlock}>
          <Text style={GlobalStyles.statLabel}>WORKOUTS THIS WEEK</Text>
          <Text style={GlobalStyles.statValue}>3</Text>
        </View>
        
      </View>
    </View>
  );
}

