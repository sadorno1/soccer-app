import { COLORS } from '@/constants/Colors'
import { useWorkout } from '@/context/WorkoutContext'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { VideoView, useVideoPlayer } from 'expo-video'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

// Firebase imports
import { useAuth } from '@/context/AuthContext'; // Import AuthContext
import { db } from '@/lib/firebase'

type Phase = 'ready' | 'active' | 'rest'
type Foot = 'default' | 'left' | 'right'

export default function StartWorkoutScreen() {
  // Route + Context
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { workouts, activeWorkoutId, completeWorkoutSession } = useWorkout()
  const { user } = useAuth() // Get current user

  // Redirect if workout not found
  const workout = workouts.find(w => w.id === id)
  useEffect(() => {
    if (!workout) router.replace('/my-workouts')
  }, [workout, router])
  if (!workout) return null

  // Session state
  const [exIdx, setExIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [count, setCount] = useState(10)
  const [maxRecord, setMaxRecord] = useState<Record<string, number>>({})
  const [previousBestRecords, setPreviousBestRecords] = useState<Record<string, number>>({})

  // Load previous records from the single global document
  useEffect(() => {
    const loadPreviousRecords = async () => {
      if (!user) return;
      
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const userRecordsRef = doc(db, 'workoutSessions', user.uid);
        const docSnapshot = await getDoc(userRecordsRef);
        
        if (docSnapshot.exists()) {
          const records = docSnapshot.data().records || {};
          setPreviousBestRecords(records);
          console.log('Loaded previous records (global):', records);
        } else {
          console.log('No previous records found');
          setPreviousBestRecords({});
        }
      } catch (error) {
        console.error('Error loading previous records:', error);
        setPreviousBestRecords({});
      }
    };

    loadPreviousRecords();
  }, [user]);

  // Reset on session change
  useEffect(() => {
    if (activeWorkoutId !== id) {
      setExIdx(0)
      setSetIdx(0)
      setPhase('ready')
      setCount(10)
      setMaxRecord({})
      setPreviousBestRecords({}) // Clear previous records when switching workouts
    }
  }, [activeWorkoutId, id])

  // Current exercise
  const exercise = workout.exercises[exIdx]

  // Video & timer refs
  const [isLoading, setIsLoading] = useState(true)
  const [paused, setPaused] = useState(false)
  const [pauseModalVisible, setPauseModalVisible] = useState(false)
  const [selectedFoot, setSelectedFoot] = useState<Foot>('default')
  const [inputVal, setInputVal] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  // Create video player
  const videoSource = exercise.videoUrls ? (exercise.videoUrls[selectedFoot] ?? exercise.videoUrls.default!) : null
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true
    player.muted = false
  })

  // Video loading state tracking
  useEffect(() => {
    if (player) {
      const statusUpdateInterval = setInterval(() => {
        if (player.duration > 0) {
          setIsLoading(false)
        }
      }, 100)

      return () => {
        clearInterval(statusUpdateInterval)
      }
    }
  }, [player])

  // Update video source when foot selection changes
  useEffect(() => {
    if (exercise.videoUrls && player) {
      setIsLoading(true) // Reset loading state when changing video
      const newSource = exercise.videoUrls[selectedFoot] ?? exercise.videoUrls.default!
      // Use replaceAsync to avoid UI freezes on iOS
      player.replaceAsync(newSource).catch((error) => {
        console.error('Error replacing video source:', error)
        setIsLoading(false) // Stop loading on error
      })
    }
  }, [selectedFoot, exercise.videoUrls, player])

  // Countdown helper
  const startCountdown = (secs: number, next: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCount(secs)
    timerRef.current = setInterval(() => {
      if (!paused) {
        setCount(c => (c <= 1 ? (clearInterval(timerRef.current!), next(), 0) : c - 1))
      }
    }, 1000)
  }

  // Phase transitions
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (phase === 'ready') {
      startCountdown(10, () => setPhase('active'))
    } else if (phase === 'active' && !exercise.uses_tracking) {
      startCountdown(exercise.set_duration, () => setPhase('rest'))
    } else if (phase === 'rest') {
      startCountdown(exercise.rest, () => {
        if (setIdx + 1 < exercise.sets) {
          setSetIdx(i => i + 1)
          setPhase('ready')
        } else if (exIdx + 1 < workout.exercises.length) {
          setExIdx(i => i + 1)
          setSetIdx(0)
          setPhase('ready')
        } else {
          completeWorkout()
        }
      })
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, exIdx, setIdx, paused])

  // Auto-switch foot
  useEffect(() => {
    if (exercise.perFoot) {
      setSelectedFoot(setIdx % 2 === 0 ? 'left' : 'right')
    }
  }, [setIdx])

  // Phase color
  const getPhaseColor = () =>
    phase === 'ready' ? COLORS.warning : phase === 'active' ? COLORS.success : COLORS.info

  // Firestore write - Single global record document per user
  const saveSessionToFirestore = async (currentRecords: Record<string, number>) => {
    if (!user) {
      console.error('Cannot save session - no authenticated user');
      return;
    }

    try {
      // Always use the same document ID for this user (user ID as document ID)
      const userRecordsDocId = user.uid;
      const { doc, getDoc, updateDoc, setDoc } = await import("firebase/firestore");
      const userRecordsRef = doc(db, "workoutSessions", userRecordsDocId);
      
      // Get existing records
      const docSnapshot = await getDoc(userRecordsRef);
      const prev = docSnapshot.exists() ? (docSnapshot.data().records || {}) : {};

      // Compute deltas (only exercises actually done this session)
      const updatedRecords: Record<string, number> = { ...prev };
      const improvedExercises: string[] = [];

      for (const [exerciseId, reps] of Object.entries(currentRecords)) {
        const previousBest = Number(prev[exerciseId] || 0);
        console.log(`${exerciseId}: current=${reps}, previous=${previousBest}`);
        if (reps > previousBest) {
          updatedRecords[exerciseId] = reps;
          improvedExercises.push(exerciseId);
          console.log(`🎉 Personal best: ${previousBest} → ${reps}`);
        }
      }

      const hasImprovements = improvedExercises.length > 0;

      // If no improvements, skip DB write entirely
      if (!hasImprovements) {
        console.log("No PRs; skipping write.");
        return {
          docId: userRecordsDocId,
          hasImprovements: false,
          improvedExercises: [],
        };
      }

      // If first time and literally nothing recorded, also skip creating a doc
      if (!docSnapshot.exists() && Object.keys(currentRecords).length === 0) {
        console.log("No reps this session; skipping document creation.");
        return { docId: null, hasImprovements: false, improvedExercises: [] };
      }

      if (docSnapshot.exists()) {
        // Update existing global record document
        const patch: any = { timestamp: new Date() };

        // Only write improved keys under records.*
        for (const exId of improvedExercises) {
          patch[`records.${exId}`] = updatedRecords[exId];
        }

        // Always ensure exercises array includes metadata for all improved exercises
        const existingExercises = docSnapshot.data().exercises || [];
        const exercisesById = new Map(existingExercises.map((ex: any) => [ex.id, ex]));
        
        // Add or update metadata for improved exercises
        for (const exId of improvedExercises) {
          const workoutExercise = workout.exercises.find(ex => ex.id === exId);
          if (workoutExercise) {
            exercisesById.set(exId, {
              id: exId,
              name: workoutExercise.name,
              maxReps: updatedRecords[exId] || 0
            });
          }
        }
        
        patch.exercises = Array.from(exercisesById.values());

        console.log('Updating global record document with improved exercises:', improvedExercises);
        await updateDoc(userRecordsRef, patch);
      } else {
        // Create first global record document for this user
        const firstRecords: Record<string, number> = {};
        for (const exId of Object.keys(currentRecords)) {
          firstRecords[exId] = currentRecords[exId];
        }

        console.log('Creating first global record document:', firstRecords);
        await setDoc(userRecordsRef, {
          userId: user.uid,
          timestamp: new Date(),
          records: firstRecords,
          exercises: workout.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            maxReps: firstRecords[ex.id] || 0
          }))
        });
      }

      return {
        docId: userRecordsDocId,
        hasImprovements: true,
        improvedExercises,
      };
    } catch (e) {
      console.error("Error saving session:", e);
      throw e;
    }
  };

  // Handle Done
  const handleDone = () => {
    const reps = parseInt(inputVal, 10)
    if (!isNaN(reps)) {
      setMaxRecord(prev => ({
        ...prev,
        [exercise.id]: Math.max(prev[exercise.id] || 0, reps),
      }))
    }
    setInputVal('')
    setPhase('rest')
  }

  // Complete workout - Updated to handle user-specific completion
  // StartWorkoutScreen.tsx  (inside completeWorkout)
const completeWorkout = async () => {
  try {
    const sessionResult = await saveSessionToFirestore(maxRecord);
    const exerciseSnapshot = JSON.stringify(
    workout.exercises.map(({ id, name, sets }) => ({ id, name, sets }))
  );

    /* ---------- 1. navigate away immediately ---------- */
    router.replace({
      pathname: '/workouts/[id]/complete',
      params: {
        id,
        sessionId: sessionResult?.docId || 'no-session',
        records: JSON.stringify(maxRecord),
        exercises: exerciseSnapshot,
        hasImprovements: sessionResult?.hasImprovements ? 'true' : 'false',
        improvedExercises: JSON.stringify(sessionResult?.improvedExercises || []) 
      },
    });

    /* ---------- 2. reset Quick Workout in the background ---------- */
    // don’t await; if it fails we just log the error
    completeWorkoutSession(id).catch(console.error);

    /* optional local cleanup */
    setExIdx(0);
    setSetIdx(0);
    setPhase('ready');
    setMaxRecord({});
  } catch (e) {
    console.error('Error completing workout:', e);
    alert('Failed to complete workout. Please try again.');
  }
};


  // Prev/Next
  const goPrev = () => {
    if (phase === 'rest') setPhase('active')
    else if (phase === 'active') setPhase('ready')
    else if (setIdx > 0) { setSetIdx(i => i - 1); setPhase('rest') }
    else if (exIdx > 0) { const prev = workout.exercises[exIdx-1]; setExIdx(i=>i-1); setSetIdx(prev.sets-1); setPhase('rest') }
  }
  const goNext = () => {
    if (phase === 'ready') setPhase('active')
    else if (phase === 'active') setPhase('rest')
    else if (setIdx+1 < exercise.sets) { setSetIdx(i=>i+1); setPhase('ready') }
    else if (exIdx+1 < workout.exercises.length) { setExIdx(i=>i+1); setSetIdx(0); setPhase('ready') }
    else completeWorkout()
  }

  return (
    <View style={styles.screen}>
      {/* Pause Modal */}
      <Modal transparent visible={pauseModalVisible} animationType="fade">
        <View style={styles.modalOverlay} />
        <View style={styles.pauseModal}>
          <Text style={styles.modalTitle}>Paused</Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButton} onPress={() => { setPaused(false); setPauseModalVisible(false) }}>
              <Text style={styles.modalButtonText}>Resume</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => { setPaused(false); setPauseModalVisible(false); router.replace('/my-workouts') }}>
              <Text style={styles.modalButtonText}>Exit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={32} color={COLORS.primary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
        <Pressable onPress={() => { setPaused(true); setPauseModalVisible(true) }} style={styles.headerBtn}>
          <Ionicons name="pause" size={32} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Video */}
        <View style={styles.videoContainer}>
          {exercise.videoUrls && (
            <>
              {exercise.perFoot && (
                <View style={styles.footSwitcher}>
                  {exercise.videoUrls.left && (
                    <Pressable onPress={() => setSelectedFoot('left')} style={[styles.footBtn, selectedFoot==='left' && styles.footBtnActive]}>
                      <Text style={styles.footText}>L</Text>
                    </Pressable>
                  )}
                  {exercise.videoUrls.right && (
                    <Pressable onPress={() => setSelectedFoot('right')} style={[styles.footBtn, selectedFoot==='right' && styles.footBtnActive]}>
                      <Text style={styles.footText}>R</Text>
                    </Pressable>
                  )}
                </View>
              )}
              
              <VideoView
                player={player}
                style={styles.video}
                contentFit="contain"
                allowsFullscreen={false}
                showsTimecodes={true}
              />
              
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              )}
            </>
          )}
        </View>

        {/* Timer / Input */}
        <View style={[styles.timerContainer, { backgroundColor: getPhaseColor() }]}>  
          {phase==='active' && exercise.uses_tracking ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {exercise.perFoot ? `Reps on ${selectedFoot==='left'?'Left':'Right'} foot:` : 'Reps:'}
              </Text>
              <TextInput
                style={styles.inputField}
                keyboardType="numeric"
                value={inputVal}
                onChangeText={setInputVal}
              />
              <Pressable style={styles.inputBtn} onPress={handleDone}>
                <Text style={styles.inputBtnText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.phaseText}>{phase==='ready'?'Ready':phase==='rest'?'Rest':'Go!'}</Text>
              <Text style={styles.countdown}>{count}</Text>
              <Text style={styles.phaseSubtext}>{phase==='active'?'Perform':'Next Set'}</Text>
            </>
          )}
        </View>

        {/* Pills */}
        <View style={styles.pills}>
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <View key={i} style={[styles.pill, i<setIdx&&styles.pillDone, i===setIdx&&styles.pillActive]} />
          ))}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.sectionHeading}>Preparation</Text>
          <Text style={styles.paragraph}>{exercise.setup}</Text>
          <Text style={styles.sectionHeading}>Execution</Text>
          <Text style={styles.paragraph}>{exercise.description}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={goPrev} style={styles.arrowBtn}>
          <Ionicons name="arrow-back" size={36} color={COLORS.primary} />
        </Pressable>
        <Pressable onPress={completeWorkout} style={styles.finishBtn}>
          <Text style={styles.finishText}>End Workout</Text>
        </Pressable>
        <Pressable onPress={goNext} style={styles.arrowBtn}>
          <Ionicons name="arrow-forward" size={36} color={COLORS.primary} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 32, paddingHorizontal: 20, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBtn: { width: 40, alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '700', color: COLORS.text },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  pauseModal: { position: 'absolute', top: '40%', left: '10%', right: '10%', backgroundColor: COLORS.surface, padding: 20, borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: COLORS.text },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, marginHorizontal: 8, paddingVertical: 10, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  videoContainer: { width: '100%', aspectRatio: 16/9, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  video: { width: '100%', height: '100%' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  footSwitcher: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  footBtn: { padding: 6 },
  footBtnActive: { backgroundColor: COLORS.primary },
  footText: { color: 'white', fontWeight: '600' },
  timerContainer: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  phaseText: { fontSize: 22, fontWeight: '700', color: 'white' },
  countdown: { fontSize: 56, fontWeight: '700', color: 'white' },
  phaseSubtext: { color: 'white', opacity: 0.9, marginTop: 4 },
  inputContainer: { width: '100%', alignItems: 'center' },
  inputLabel: { color: 'white', marginBottom: 8 },
  inputField: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 24, width: 120, textAlign: 'center', padding: 8, borderRadius: 8, marginBottom: 8 },
  inputBtn: { backgroundColor: 'white', padding: 8, borderRadius: 6 },
  inputBtnText: { color: COLORS.primary, fontWeight: '600' },
  pills: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  pill: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surface, marginHorizontal: 6, borderWidth: 2, borderColor: COLORS.surface },
  pillDone: { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  details: { marginBottom: 24 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginVertical: 8 },
  paragraph: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 32, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  arrowBtn: { padding: 8 },
  finishBtn: { padding: 12, backgroundColor: COLORS.error, borderRadius: 8 },
  finishText: { color: 'white', fontWeight: '700' },
})