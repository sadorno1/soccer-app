import { COLORS } from '@/constants/Colors'
import { useWorkout } from '@/context/WorkoutContext'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Audio } from 'expo-av'
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

  // Audio setup for beep sounds
  const [beepSound, setBeepSound] = useState<Audio.Sound | null>(null)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  
  // Load sound preference from storage
  useEffect(() => {
    const loadSoundPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem('workoutSoundEnabled')
        if (savedPreference !== null) {
          setSoundEnabled(JSON.parse(savedPreference))
          console.log('Loaded sound preference:', JSON.parse(savedPreference))
        }
      } catch (error) {
        console.error('Error loading sound preference:', error)
      }
    }
    
    loadSoundPreference()
  }, [])
  
  // Save sound preference when it changes
  const toggleSound = async (newValue: boolean) => {
    try {
      setSoundEnabled(newValue)
      await AsyncStorage.setItem('workoutSoundEnabled', JSON.stringify(newValue))
      console.log('Saved sound preference:', newValue)
    } catch (error) {
      console.error('Error saving sound preference:', error)
    }
  }
  
  // Initialize beep sound
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        })
        
        // Audio system initialized - sounds will be generated dynamically
        setBeepSound(null) // We'll generate sounds on-demand to avoid file loading issues
        console.log('Audio system initialized - ready for dynamic alarm generation')
        
      } catch (error) {
        console.error('Audio setup error:', error)
        setBeepSound(null)
      }
    }
    
    setupAudio()
    
    return () => {
      if (beepSound) {
        beepSound.unloadAsync()
      }
    }
  }, [])

  // Play bell alarm sound function
  const playBeep = async () => {
    // Check if sound is enabled
    if (!soundEnabled) {
      console.log('Sound disabled - skipping beep')
      return
    }
    
    try {
      // Create a simple but effective alarm sound using Web Audio-compatible approach
      const createSimpleAlarmSound = () => {
        const sampleRate = 22050 // Lower sample rate for smaller file size
        const duration = 0.5 // Half second alarm
        const samples = Math.floor(sampleRate * duration)
        const buffer = new ArrayBuffer(44 + samples * 2)
        const view = new DataView(buffer)
        
        // WAV header
        view.setUint32(0, 0x46464952, true) // 'RIFF'
        view.setUint32(4, 36 + samples * 2, true)
        view.setUint32(8, 0x45564157, true) // 'WAVE'
        view.setUint32(12, 0x20746d66, true) // 'fmt '
        view.setUint32(16, 16, true)
        view.setUint16(20, 1, true) // PCM
        view.setUint16(22, 1, true) // Mono
        view.setUint32(24, sampleRate, true)
        view.setUint32(28, sampleRate * 2, true)
        view.setUint16(32, 2, true)
        view.setUint16(34, 16, true)
        view.setUint32(36, 0x61746164, true) // 'data'
        view.setUint32(40, samples * 2, true)
        
        // Generate triple beep alarm pattern
        for (let i = 0; i < samples; i++) {
          const t = i / sampleRate
          const beepFreq = 880 // A5 note - attention-grabbing frequency
          
          // Create 3 distinct beeps with gaps
          const beepTime = 0.12 // Each beep lasts 120ms
          const gapTime = 0.04 // 40ms gap between beeps
          const cycleTime = beepTime + gapTime
          
          const cycle = Math.floor(t / cycleTime)
          const timeInCycle = t % cycleTime
          
          let amplitude = 0
          if (cycle < 3 && timeInCycle < beepTime) {
            // We're in a beep phase
            const beepProgress = timeInCycle / beepTime
            // Sharp attack, quick decay for alarm effect
            const envelope = beepProgress < 0.05 ? beepProgress / 0.05 : Math.exp(-(beepProgress - 0.05) * 12)
            
            // Mix of sine and square wave for harsh alarm sound
            const sine = Math.sin(2 * Math.PI * beepFreq * t)
            const square = Math.sign(sine) * 0.4
            amplitude = (sine * 0.8 + square) * envelope
          }
          
          const sample = Math.max(-32767, Math.min(32767, amplitude * 25000))
          view.setInt16(44 + i * 2, sample, true)
        }
        
        // Convert to base64
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
      }
      
      const alarmBase64 = createSimpleAlarmSound()
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${alarmBase64}` },
        { shouldPlay: true, volume: 1.0 }
      )
      
      // Clean up after playing
      setTimeout(() => sound.unloadAsync().catch(() => {}), 800)
      console.log('Alarm sound played successfully!')
      
    } catch (error) {
      console.error('Error playing alarm sound:', error)
      console.log('🚨 WORKOUT PHASE TRANSITION! 🚨')
    }
  }

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
          // Convert new format {exerciseId: {value: number, timestamp: Date}} to old format {exerciseId: number}
          const previousRecords: Record<string, number> = {};
          for (const [exerciseId, recordData] of Object.entries(records)) {
            if (typeof recordData === 'number') {
              // Old format - backward compatibility
              previousRecords[exerciseId] = recordData;
            } else if (recordData && typeof recordData === 'object' && 'value' in recordData) {
              // New format
              previousRecords[exerciseId] = (recordData as any).value;
            }
          }
          setPreviousBestRecords(previousRecords);
          console.log('Loaded previous records (global):', previousRecords);
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
    timerRef.current = setInterval(() => {
      if (!paused) {
        setCount(c => {
          if (c <= 1) {
            clearInterval(timerRef.current!)
            playBeep() // Play beep on phase transition
            next()
            return 0
          }
          return c - 1
        })
      }
    }, 1000)
  }

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (phase === 'ready') {
      setCount(10)
      startCountdown(10, () => setPhase('active'))
    } else if (phase === 'active' && !exercise.uses_tracking) {
      const duration = exercise.set_duration || 30
      setCount(duration)
      startCountdown(duration, () => setPhase('rest'))
    } else if (phase === 'active' && exercise.uses_tracking && typeof exercise.set_duration === 'number' && exercise.set_duration > 1) {
      setCount(exercise.set_duration)
      startCountdown(exercise.set_duration, () => {
        console.log('Timer finished - waiting for user to complete set')
      })
    } else if (phase === 'rest') {
      setCount(exercise.rest)
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
  }

  // Phase transitions
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    // Don't reset timer when just pausing/resuming
    if (paused) {
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
    
    // Always set the correct timer value for each phase
    let initialTime = count
    if (phase === 'ready') {
      initialTime = 10
      setCount(10)
    } else if (phase === 'active' && !exercise.uses_tracking) {
      initialTime = exercise.set_duration || 30
      setCount(initialTime)
    } else if (phase === 'active' && exercise.uses_tracking && typeof exercise.set_duration === 'number' && exercise.set_duration > 1) {
      initialTime = exercise.set_duration
      setCount(initialTime)
    } else if (phase === 'rest') {
      initialTime = exercise.rest
      setCount(initialTime)
    }
    
    // Start appropriate countdown
    if (phase === 'ready') {
      startCountdown(initialTime, () => setPhase('active'))
    } else if (phase === 'active' && !exercise.uses_tracking) {
      startCountdown(initialTime, () => setPhase('rest'))
    } else if (phase === 'active' && exercise.uses_tracking && typeof exercise.set_duration === 'number' && exercise.set_duration > 1) {
      startCountdown(initialTime, () => {
        console.log('Timer finished - waiting for user to complete set')
      })
    } else if (phase === 'rest') {
      startCountdown(initialTime, () => {
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
  }, [phase, exIdx, setIdx])

  // Handle resume from pause - restart timer with current count
  useEffect(() => {
    if (!paused && count > 0 && timerRef.current === null) {
      // Determine what should happen when timer reaches 0 based on current phase
      let onComplete: () => void
      
      if (phase === 'ready') {
        onComplete = () => setPhase('active')
      } else if (phase === 'active' && !exercise.uses_tracking) {
        onComplete = () => setPhase('rest')
      } else if (phase === 'active' && exercise.uses_tracking && typeof exercise.set_duration === 'number' && exercise.set_duration > 1) {
        onComplete = () => console.log('Timer finished - waiting for user to complete set')
      } else if (phase === 'rest') {
        onComplete = () => {
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
        }
      } else {
        return // No timer needed for this phase
      }
      
      startCountdown(count, onComplete)
    }
  }, [paused])

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
      const updatedRecords: Record<string, number> = {};
      const improvedExercises: string[] = [];

      for (const [exerciseId, reps] of Object.entries(currentRecords)) {
        // Extract previous best value - handle both old and new formats
        let previousBest = 0;
        if (prev[exerciseId]) {
          if (typeof prev[exerciseId] === 'number') {
            // Old format
            previousBest = Number(prev[exerciseId]);
          } else if (prev[exerciseId] && typeof prev[exerciseId] === 'object' && 'value' in prev[exerciseId]) {
            // New format
            previousBest = Number((prev[exerciseId] as any).value || 0);
          }
        }
        const workoutExercise = workout.exercises.find(ex => ex.id === exerciseId);
        // Respect explicit max_is_good; default to false (lower is better) when not specified
        const maxIsGood = workoutExercise?.max_is_good ?? false;
        
        console.log(`${exerciseId}: current=${reps}, previous=${previousBest}, maxIsGood=${maxIsGood}`);
        
        let isImprovement = false;
        if (previousBest === 0) {
          // First time doing this exercise is always an improvement if a positive value exists
          isImprovement = reps > 0;
        } else if (maxIsGood) {
          // Higher is better
          isImprovement = reps > previousBest;
        } else {
          // Lower is better
          isImprovement = reps < previousBest;
        }
        
        if (isImprovement) {
          updatedRecords[exerciseId] = reps;
          improvedExercises.push(exerciseId);
          console.log(`🎉 Personal best: ${previousBest} → ${reps} (${maxIsGood ? 'higher is better' : 'lower is better'})`);
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

        // Only write improved keys under records.* with individual timestamps
        const currentTimestamp = new Date();
        for (const exId of improvedExercises) {
          patch[`records.${exId}`] = {
            value: updatedRecords[exId],
            timestamp: currentTimestamp
          };
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
              maxReps: updatedRecords[exId] || 0,
              max_is_good: workoutExercise.max_is_good ?? false,
            });
          }
        }
        
        patch.exercises = Array.from(exercisesById.values());

        console.log('Updating global record document with improved exercises:', improvedExercises);
        await updateDoc(userRecordsRef, patch);
        
        return {
          docId: userRecordsDocId,
          hasImprovements: true,
          improvedExercises,
        };
      } else {
        // Create first global record document for this user
        const firstRecords: Record<string, any> = {};
        const firstTimeImprovedExercises: string[] = [];
        const currentTimestamp = new Date();
        
        for (const exId of Object.keys(currentRecords)) {
          firstRecords[exId] = {
            value: currentRecords[exId],
            timestamp: currentTimestamp
          };
          // For first time, only exercises with actual recorded reps are "improvements"
          if (currentRecords[exId] > 0) {
            firstTimeImprovedExercises.push(exId);
          }
        }

        console.log('Creating first global record document:', firstRecords);
        await setDoc(userRecordsRef, {
          userId: user.uid,
          timestamp: currentTimestamp,
          records: firstRecords,
          exercises: Object.keys(firstRecords).map(exId => {
            const workoutExercise = workout.exercises.find(ex => ex.id === exId);
            return {
              id: exId,
              name: workoutExercise?.name || 'Unknown Exercise',
              maxReps: firstRecords[exId].value || 0,
              max_is_good: workoutExercise?.max_is_good ?? false,
            };
          })
        });
        
        return {
          docId: userRecordsDocId,
          hasImprovements: firstTimeImprovedExercises.length > 0,
          improvedExercises: firstTimeImprovedExercises,
        };
      }
    } catch (e) {
      console.error("Error saving session:", e);
      throw e;
    }
  };

  // Handle Done
  const handleDone = () => {
    playBeep() // Play beep when completing a set
    const reps = parseInt(inputVal, 10)
    if (!isNaN(reps)) {
      // Track the maximum reps for this exercise during this session
      setMaxRecord(prev => ({
        ...prev,
        [exercise.id]: Math.max(prev[exercise.id] || 0, reps),
      }))
    }
    setInputVal('')
    setPhase('rest')
  }

  // Complete workout with specific record data
  const completeWorkoutWithRecord = async (recordData: Record<string, number>) => {
    try {
      const sessionResult = await saveSessionToFirestore(recordData);
      const exerciseSnapshot = JSON.stringify(
        workout.exercises.map(({ id, name, sets }) => ({ id, name, sets }))
      );

      /* ---------- 1. navigate away immediately ---------- */
      router.replace({
        pathname: '/workouts/[id]/complete',
        params: {
          id,
          sessionId: sessionResult?.docId || 'no-session',
          records: JSON.stringify(recordData),
          exercises: exerciseSnapshot,
          hasImprovements: sessionResult?.hasImprovements ? 'true' : 'false',
          improvedExercises: JSON.stringify(sessionResult?.improvedExercises || []) 
        },
      });

      /* ---------- 2. reset Quick Workout in the background ---------- */
      // don't await; if it fails we just log the error
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

  // Complete workout - Updated to handle user-specific completion
  // StartWorkoutScreen.tsx  (inside completeWorkout)
const completeWorkout = async () => {
  try {
    // If we're in an active tracking phase with input, save it first
    let finalMaxRecord = { ...maxRecord };
    if (phase === 'active' && exercise.uses_tracking && inputVal.trim()) {
      const reps = parseInt(inputVal, 10);
      if (!isNaN(reps)) {
        finalMaxRecord[exercise.id] = Math.max(finalMaxRecord[exercise.id] || 0, reps);
        console.log(`Saving current input before completing workout: ${exercise.id} = ${reps}`);
      }
    }

    const sessionResult = await saveSessionToFirestore(finalMaxRecord);
    const exerciseSnapshot = JSON.stringify(
    workout.exercises.map(({ id, name, sets }) => ({ id, name, sets }))
  );

    /* ---------- 1. navigate away immediately ---------- */
    router.replace({
      pathname: '/workouts/[id]/complete',
      params: {
        id,
        sessionId: sessionResult?.docId || 'no-session',
        records: JSON.stringify(finalMaxRecord),
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
    playBeep() // Play beep on navigation
    if (phase === 'rest') setPhase('active')
    else if (phase === 'active') setPhase('ready')
    else if (setIdx > 0) { setSetIdx(i => i - 1); setPhase('rest') }
    else if (exIdx > 0) { const prev = workout.exercises[exIdx-1]; setExIdx(i=>i-1); setSetIdx(prev.sets-1); setPhase('rest') }
  }
  const goNext = () => {
    playBeep() // Play beep on navigation
    // If we're in active phase with tracking and have input, save it first
    if (phase === 'active' && exercise.uses_tracking && inputVal.trim()) {
      const reps = parseInt(inputVal, 10);
      if (!isNaN(reps)) {
        const updatedMaxRecord = {
          ...maxRecord,
          [exercise.id]: Math.max(maxRecord[exercise.id] || 0, reps),
        };
        setMaxRecord(updatedMaxRecord);
        setInputVal(''); // Clear input after saving
        
        // Check if this active->rest transition would complete the workout
        const isLastSet = setIdx + 1 >= exercise.sets;
        const isLastExercise = exIdx + 1 >= workout.exercises.length;
        if (isLastSet && isLastExercise) {
          // Complete workout with the updated record
          completeWorkoutWithRecord(updatedMaxRecord);
          return;
        }
        
        // Continue with normal flow
        setPhase('rest');
        return;
      }
    }

    // Handle other phase transitions
    if (phase === 'ready') {
      setPhase('active')
    } else if (phase === 'active') {
      setPhase('rest')
    } else if (phase === 'rest') {
      if (setIdx + 1 < exercise.sets) {
        setSetIdx(i => i + 1);
        setPhase('ready');
      } else if (exIdx + 1 < workout.exercises.length) {
        setExIdx(i => i + 1);
        setSetIdx(0);
        setPhase('ready');
      } else {
        // This is where we complete the workout when navigating with next
        // Use the accumulated maxRecord to ensure personal bests are detected
        completeWorkoutWithRecord(maxRecord);
      }
    }
  }

  return (
    <View style={styles.screen}>
      {/* Pause Modal */}
      <Modal transparent visible={pauseModalVisible} animationType="fade">
        <View style={styles.modalOverlay} />
        <View style={styles.pauseModal}>
          <Text style={styles.modalTitle}>Paused</Text>
          
          {/* Sound Toggle Option */}
          <View style={styles.soundToggleContainer}>
            <Text style={styles.soundToggleLabel}>Workout Sounds</Text>
            <Pressable 
              style={[styles.soundToggle, soundEnabled && styles.soundToggleActive]} 
              onPress={() => toggleSound(!soundEnabled)}
            >
              <View style={[styles.soundToggleSlider, soundEnabled && styles.soundToggleSliderActive]}>
                <Ionicons 
                  name={soundEnabled ? 'volume-high' : 'volume-mute'} 
                  size={16} 
                  color={soundEnabled ? COLORS.primary : '#666'} 
                />
              </View>
            </Pressable>
          </View>
          
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.modalButton, styles.resumeButton]} 
              onPress={() => { setPaused(false); setPauseModalVisible(false) }}
            >
              <Text style={styles.modalButtonText}>Resume</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
    
        <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
        <Pressable onPress={() => { 
          setPaused(true); 
          setPauseModalVisible(true);
          // Clear the timer when pausing
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }} style={styles.headerBtn}>
          <Ionicons name="pause" size={32} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Video */}
        <View style={styles.videoContainer}>
          {exercise.videoUrls && (
            <>
              {/* Always show foot switcher if exercise has left/right videos */}
              {(exercise.videoUrls.left || exercise.videoUrls.right) && (
                <View style={styles.footSwitcher}>
                  {exercise.videoUrls.left && (
                    <Pressable
                      onPress={() => setSelectedFoot('left')}
                      style={[styles.footBtn, selectedFoot==='left' && styles.footBtnActive]}
                    >
                      <Text style={styles.footText}>L</Text>
                    </Pressable>
                  )}
                  {exercise.videoUrls.right && (
                    <Pressable
                      onPress={() => setSelectedFoot('right')}
                      style={[styles.footBtn, selectedFoot==='right' && styles.footBtnActive]}
                    >
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
              <View style={styles.inputHeader}>
                <Text style={styles.inputTitle}>Enter reps</Text>
                <Text style={styles.inputSubtitle}>
                  {typeof exercise.successful_reps === 'number' && exercise.successful_reps > 0
                    ? `Attempts for ${exercise.successful_reps} successful repetitions`
                    : 'Number of successful repetitions'}
                </Text>
                {(exercise.perFoot || exercise.videoUrls?.left || exercise.videoUrls?.right) && (
                  <View style={styles.footBadge}>
                    <Text style={styles.footBadgeText}>
                      {selectedFoot === 'left' ? 'Left Foot' : selectedFoot === 'right' ? 'Right Foot' : 'Either Foot'}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* If tracking has a set duration, show timer in active phase */}
              {exercise.uses_tracking && typeof exercise.set_duration === 'number' && exercise.set_duration > 1 && (
                <View style={styles.timerDisplay}>
                  <Pressable onPress={resetTimer} style={styles.resetTimerMainBtn}>
                    <Ionicons name="refresh" size={20} color="#fff" />
                  </Pressable>
                  <View style={styles.timerMainDisplay}>
                    <Text style={styles.timerLabel}>Time left</Text>
                    <Text style={styles.timerCount}>{count}s</Text>
                    <Text style={styles.timerUnit}>seconds</Text>
                  </View>
                </View>
              )}

              {/* Reps input */}
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  keyboardType="number-pad"
                  value={inputVal}
                  onChangeText={setInputVal}
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
                <Text style={styles.inputUnit}>reps</Text>
              </View>

              {/* Done button */}
              {(() => {
                const repsNum = parseInt(inputVal, 10);
                const valid = !isNaN(repsNum) && repsNum >= 0;
                return (
                  <Pressable
                    onPress={handleDone}
                    disabled={!valid}
                    style={[styles.inputBtn, valid ? styles.inputBtnActive : styles.inputBtnDisabled]}
                  >
                    <Text style={[styles.inputBtnText, valid ? styles.inputBtnTextActive : styles.inputBtnTextDisabled]}>Done</Text>
                  </Pressable>
                );
              })()}
            </View>
          ) : (
            // Fallback: show the phase countdown for non-tracking active, ready, and rest
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.phaseText}>
                {phase === 'ready' ? 'Get Ready' : phase === 'rest' ? 'Rest' : 'Active'}
              </Text>
              <Text style={styles.countdown}>{count}</Text>
              <Text style={styles.phaseSubtext}>
                {phase === 'ready' ? 'Starting soon' : phase === 'rest' ? 'Recover' : (!exercise.uses_tracking ? 'Keep going' : '')}
              </Text>
            </View>
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
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="construct" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.detailTitle}>Setup</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{exercise.setup}</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="walk" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.detailTitle}>Execution</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{exercise.description}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={goPrev} style={styles.arrowBtn}>
          <Ionicons name="arrow-back" size={40} color={COLORS.primary} />
        </Pressable>
        <Pressable onPress={completeWorkout} style={styles.finishBtn}>
          <Text style={styles.finishText}>Finish</Text>
        </Pressable>
        <Pressable onPress={goNext} style={styles.arrowBtn}>
          <Ionicons name="arrow-forward" size={40} color={COLORS.primary} />
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
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  pauseModal: { 
    position: 'absolute', 
    top: '35%', 
    left: '8%', 
    right: '8%', 
    backgroundColor: COLORS.surface, 
    padding: 32, 
    borderRadius: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: COLORS.text },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 16 },
  modalButton: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resumeButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: { color: 'white', fontWeight: '600', fontSize: 18 },
  soundToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  soundToggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  soundToggle: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  soundToggleActive: {
    backgroundColor: COLORS.primary + '40',
  },
  soundToggleSlider: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  soundToggleSliderActive: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  videoContainer: { width: '100%', aspectRatio: 16/9, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  video: { width: '100%', height: '100%' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  footSwitcher: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, zIndex: 10 },
  footBtn: { padding: 6 },
  footBtnActive: { backgroundColor: COLORS.primary },
  footText: { color: 'white', fontWeight: '600' },
  footBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  footBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  timerContainer: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  phaseText: { fontSize: 22, fontWeight: '700', color: 'white' },
  countdown: { fontSize: 56, fontWeight: '700', color: 'white' },
  phaseSubtext: { color: 'white', opacity: 0.9, marginTop: 4 },
  inputContainer: { width: '100%', alignItems: 'center', paddingVertical: 8 },
  inputHeader: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  inputTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  inputSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    minWidth: 180,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputField: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: '700',
    flex: 1,
    paddingVertical: 12,
  },
  inputUnit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputBtn: { 
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inputBtnActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
  },
  inputBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowColor: 'transparent',
  },
  inputBtnText: { 
    fontWeight: '700', 
    fontSize: 16 
  },
  inputBtnTextActive: {
    color: COLORS.success,
  },
  inputBtnTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
  timerDisplay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    minWidth: 260,
  },
  resetTimerBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerMainDisplay: {
    alignItems: 'center',
  },
  resetTimerMainBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timerCount: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
  },
  timerUnit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  pills: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  pill: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surface, marginHorizontal: 6, borderWidth: 2, borderColor: COLORS.surface },
  pillDone: { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  details: { marginBottom: 24 },
  detailSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginVertical: 8 },
  paragraph: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 32, 
    backgroundColor: COLORS.surface, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  arrowBtn: { 
    padding: 16,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  finishBtn: { 
    paddingHorizontal: 32,
    paddingVertical: 16, 
    backgroundColor: COLORS.error, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  finishText: { color: 'white', fontWeight: '700', fontSize: 18 },
})