// app/(tabs)/workouts/[id]/start.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';

export default function StartWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts } = useWorkout();
  const workout = workouts.find((w) => w.id === id);

  // indices and phase
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'active' | 'rest'>('ready');
  const [count, setCount] = useState(10); // initial get-ready
  const [inputVal, setInputVal] = useState('');
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Not Found</Text>
      </View>
    );
  }
  const exercise = workout.exercises[exIdx];

  const startCountdown = (seconds: number, next: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCount(seconds);
    timerRef.current = setInterval(() => {
      if (!paused) {
        setCount((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current!);
            next();
            return 0;
          }
          return c - 1;
        });
      }
    }, 1000);
  };

  useEffect(() => {
    // cleanup previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // don't start if paused or no exercise
    if (!exercise) return;

    if (phase === 'ready') {
      startCountdown(10, () => setPhase('active')); // get ready 10s
    } else if (phase === 'active') {
      if (!exercise.uses_tracking) {
        startCountdown(exercise.set_duration, () => setPhase('rest'));
      }
      // uses_tracking: user input handles transition
    } else if (phase === 'rest') {
      startCountdown(30, () => {
        // advance set or exercise
        if (setIdx + 1 < exercise.sets) {
          setSetIdx((i) => i + 1);
          setPhase('ready');
        } else if (exIdx + 1 < workout.exercises.length) {
          setExIdx((i) => i + 1);
          setSetIdx(0);
          setPhase('ready');
        } else {
          router.back();
        }
      });
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, exIdx, setIdx, paused]);

  const goPrev = () => {
    if (phase === 'rest') setPhase('active');
    else if (phase === 'active') setPhase('ready');
    else {
      if (setIdx > 0) {
        setSetIdx((i) => i - 1);
        setPhase('rest');
      } else if (exIdx > 0) {
        const prevEx = workout.exercises[exIdx - 1];
        setExIdx((i) => i - 1);
        setSetIdx(prevEx.sets - 1);
        setPhase('rest');
      }
    }
  };

  const goNext = () => {
    if (phase === 'ready') setPhase('active');
    else if (phase === 'active') setPhase('rest');
    else {
      if (setIdx + 1 < exercise.sets) {
        setSetIdx((i) => i + 1);
        setPhase('ready');
      } else if (exIdx + 1 < workout.exercises.length) {
        setExIdx((i) => i + 1);
        setSetIdx(0);
        setPhase('ready');
      } else {
        router.back();
      }
    }
  };

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
        source={{ uri: exercise.imageUri || 'https://via.placeholder.com/350x150' }}
        style={styles.image}
      />

      {/* PILLS */}
      <View style={styles.pills}>
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <View
            key={i}
            style={[styles.pill, i === setIdx && styles.pillActive]}>
            <Text style={i === setIdx ? styles.pillTextActive : styles.pillText}>
              {i + 1}
            </Text>
          </View>
        ))}
      </View>

      {/* COUNT / INPUT */}
      <View style={styles.controlRow}>
        {(phase === 'active' && exercise.uses_tracking) ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter reps"
              keyboardType="numeric"
              value={inputVal}
              onChangeText={setInputVal}
            />
            <Pressable style={styles.inputBtn} onPress={() => setPhase('rest')}>
              <Text style={styles.inputBtnText}>Done</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.countdown}>
              {phase === 'ready'
                ? 'Get ready! '
                : phase === 'rest'
                ? 'Rest '
                : ''}
              {count}
            </Text>
            <Text style={styles.subheading}>
              {phase === 'active'
                ? 'Perform the exercise'
                : phase === 'rest'
                ? 'Rest up'
                : ''}
            </Text>
          </>
        )}
      </View>

      {/* PAUSE BUTTON */}
      <View style={styles.pauseContainer}>
        <Pressable style={styles.pauseBtn} onPress={() => setPaused((p) => !p)}>
          <Text style={styles.pauseText}>{paused ? 'Resume' : 'Pause'}</Text>
        </Pressable>
      </View>

      {/* DETAILS */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.sectionHeading}>Preparation</Text>
        <Text style={styles.paragraph}>{exercise.setup}</Text>

        <Text style={styles.sectionHeading}>Execution</Text>
        <Text style={styles.paragraph}>{exercise.description}</Text>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable onPress={goPrev} disabled={exIdx === 0 && setIdx === 0 && phase === 'ready'}>
          <Text style={styles.navArrow}>←</Text>
        </Pressable>
        <Pressable style={styles.finishBtn} onPress={() => router.back()}>
          <Text style={styles.finishText}>End workout</Text>
        </Pressable>
        <Pressable onPress={goNext}>
          <Text style={styles.navArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  pillActive: { backgroundColor: COLORS.primary },
  pillText: { color: COLORS.text, fontSize: 18 },
  pillTextActive: { color: COLORS.background, fontSize: 18 },

  controlRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
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
  pauseContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pauseBtn: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
  },
  pauseText: { color: COLORS.primary, fontWeight: '600' },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    marginRight: 12,
    color: COLORS.text,
  },
  inputBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  inputBtnText: { color: COLORS.background, fontWeight: '600' },

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