import { COLORS } from '@/constants/Colors'
import { useWorkout } from '@/context/WorkoutContext'
import { Ionicons } from '@expo/vector-icons'
import { ResizeMode, Video } from 'expo-av'
import { useLocalSearchParams, useRouter } from 'expo-router'
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
import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'

type Phase = 'ready' | 'active' | 'rest'
type Foot = 'default' | 'left' | 'right'

export default function StartWorkoutScreen() {
  // Route + Context
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { workouts, activeWorkoutId, completeWorkoutSession } = useWorkout()

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

  // Reset on session change
  useEffect(() => {
    if (activeWorkoutId !== id) {
      setExIdx(0)
      setSetIdx(0)
      setPhase('ready')
      setCount(10)
      setMaxRecord({})
    }
  }, [activeWorkoutId, id])

  // Current exercise
  const exercise = workout.exercises[exIdx]

  // Video & timer refs
  const videoRef = useRef<Video>(null)
  const [videoStatus, setVideoStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paused, setPaused] = useState(false)
  const [pauseModalVisible, setPauseModalVisible] = useState(false)
  const [selectedFoot, setSelectedFoot] = useState<Foot>('default')
  const [inputVal, setInputVal] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // Video status handler
  const onStatusUpdate = (status: any) => {
    setVideoStatus(status)
    if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
      setIsLoading(false)
    }
  }

  const togglePlayback = async () => {
    if (videoStatus?.isPlaying) {
      await videoRef.current?.pauseAsync()
    } else {
      await videoRef.current?.playAsync()
    }
  }

  // Phase color
  const getPhaseColor = () =>
    phase === 'ready' ? COLORS.warning : phase === 'active' ? COLORS.success : COLORS.info

  // Firestore write
  const saveSessionToFirestore = async (records: Record<string, number>) => {
    console.log('Saving session with records:', records)
    try {
      const docRef = await addDoc(collection(db, 'workoutSessions'), {
        workoutId: id,
        timestamp: new Date(),
        records,
      })
      console.log('Saved session ID:', docRef.id)
    } catch (e) {
      console.error('Error saving session:', e)
    }
  }

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

  // Complete workout
  const completeWorkout = async () => {
    completeWorkoutSession(id)
    await saveSessionToFirestore(maxRecord)
    router.replace({
      pathname: '/workouts/[id]/complete',
      params: { id, records: JSON.stringify(maxRecord) },
    })
  }

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
              <Video
                ref={videoRef}
                source={{ uri: exercise.videoUrls[selectedFoot] ?? exercise.videoUrls.default! }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls={false}
                isLooping={false}
                onPlaybackStatusUpdate={onStatusUpdate}
              />
              {isLoading && <ActivityIndicator style={styles.loading} size="large" color={COLORS.primary} />}
              {!isLoading && !videoStatus?.isPlaying && (
                <Pressable onPress={togglePlayback} style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </Pressable>
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
  loading: { position: 'absolute' },
  playButton: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 48, color: 'white' },
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
