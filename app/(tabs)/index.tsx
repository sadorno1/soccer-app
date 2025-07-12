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
        <Text style={GlobalStyles.buttonText}>START WORKOUT</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
    marginTop: 20,

  },
  startButton: {
    backgroundColor: '#14532d',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});