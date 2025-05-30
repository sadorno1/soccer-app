// app/(tabs)/workouts/[id]/start.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';

export default function StartWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts } = useWorkout();
  const workout = workouts.find((w) => w.id === id);

  /* ─────────── runtime state ─────────── */
  const [exIdx, setExIdx] = useState(0);     // which exercise
  const [setIdx, setSetIdx] = useState(0);   // which set inside exercise
  const [phase, setPhase] = useState<'ready' | 'active' | 'rest'>('ready');
  const [count, setCount] = useState(5);     // countdown seconds

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  /* ─────────── helpers ─────────── */
  const exercise = workout?.exercises[exIdx];

  const startCountdown = (seconds: number, next: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCount(seconds);
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          next();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  /* ─────────── start timers on phase changes ─────────── */
  useEffect(() => {
    if (!exercise) return;

    if (phase === 'ready') {
      startCountdown(5, () => setPhase('active'));
    } else if (phase === 'active') {
      startCountdown(exercise.set_duration, () => setPhase('rest'));
    } else if (phase === 'rest') {
      // rest lasts 5 s; then go to next set / exercise
      startCountdown(5, () => {
        const moreSets = setIdx + 1 < exercise.sets;
        if (moreSets) {
          setSetIdx((i) => i + 1);
          setPhase('ready');
        } else {
          const moreExercises = exIdx + 1 < workout!.exercises.length;
          if (moreExercises) {
            setExIdx((i) => i + 1);
            setSetIdx(0);
            setPhase('ready');
          } else {
            router.back(); // workout finished
          }
        }
      });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, exIdx, setIdx]);

  /* ─────────── manual nav (skip) ─────────── */
  const skipPrev = () => {
    if (setIdx > 0) {
      setSetIdx((i) => i - 1);
      setPhase('ready');
    } else if (exIdx > 0) {
      const prevEx = workout!.exercises[exIdx - 1];
      setExIdx((i) => i - 1);
      setSetIdx(prevEx.sets - 1);
      setPhase('ready');
    }
  };

  const skipNext = () => {
    if (setIdx + 1 < exercise!.sets) {
      setSetIdx((i) => i + 1);
      setPhase('ready');
    } else if (exIdx + 1 < workout!.exercises.length) {
      setExIdx((i) => i + 1);
      setSetIdx(0);
      setPhase('ready');
    }
  };

  /* ─────────── guard if workout not found ─────────── */
  if (!workout || !exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Not Found</Text>
      </View>
    );
  }

  /* ─────────── UI ─────────── */
  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.navArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={{
          uri: exercise.imageUri ?? 'https://via.placeholder.com/350x150',
        }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* BIG PILLS */}
      <View style={styles.pills}>
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.pill,
              i === setIdx && styles.pillActive,
            ]}>
            <Text style={i === setIdx ? styles.pillTextActive : styles.pillText}>
              {i + 1}
            </Text>
          </View>
        ))}
      </View>

      {/* COUNTDOWN */}
      <Text style={styles.countdown}>
        {phase === 'ready' && 'Get ready! '}
        {count}
      </Text>
      <Text style={styles.subheading}>
        {phase === 'active'
          ? 'Perform the exercise'
          : phase === 'rest'
          ? 'Rest'
          : ''}
      </Text>

      {/* DETAILS */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.sectionHeading}>Preparation</Text>
        <Text style={styles.paragraph}>{exercise.setup}</Text>

        <Text style={styles.sectionHeading}>Execution</Text>
        <Text style={styles.paragraph}>{exercise.description}</Text>
      </ScrollView>

      {/* FOOTER NAV */}
      <View style={styles.footer}>
        <Pressable onPress={skipPrev} disabled={exIdx === 0 && setIdx === 0}>
          <Text style={styles.navArrow}>←</Text>
        </Pressable>

        <Pressable style={styles.finishBtn} onPress={() => router.back()}>
          <Text style={styles.finishText}>End workout</Text>
        </Pressable>

        <Pressable
          onPress={skipNext}
          disabled={
            exIdx === workout.exercises.length - 1 &&
            setIdx === exercise.sets - 1
          }>
          <Text style={styles.navArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ─────────── styles ─────────── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  navArrow: { fontSize: 28, color: COLORS.primary },
  image: { width: '100%', height: 200, backgroundColor: '#222' },

  pills: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  pillActive: { backgroundColor: COLORS.primary },
  pillText: { color: COLORS.text, fontSize: 16 },
  pillTextActive: { color: COLORS.background, fontSize: 16 },

  countdown: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },

  detailsContainer: { flex: 1, paddingHorizontal: 16 },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: COLORS.text,
  },
  paragraph: { fontSize: 14, color: COLORS.text, marginTop: 4 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  finishBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  finishText: { color: COLORS.background, fontWeight: '600' },
});
