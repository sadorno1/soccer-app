//settings 
// SETTINGS (drop-in replacement)
import { COLORS } from '@/constants/Colors';
import {
  addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  deleteObject,
  doc,
  getDocs,
  getDownloadURL,
  getIdTokenResult,
  onAuthStateChanged,
  ref,
  signOut,
  storage,
  updateDoc,
  uploadBytes,
  User
} from '@/lib/firebase';
import { GlobalStyles } from '@/theme';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

/* ──────────────────────────── Small UI Pieces ──────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={[GlobalStyles.sectionTitle, { marginTop: 12, marginBottom: 8, color: COLORS.accent }]}>{children}</Text>;
}

function LabeledNumber({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
}) {
  const [textValue, setTextValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sync text value when prop changes, but only when not focused
  useEffect(() => {
    if (!isFocused) {
      setTextValue(Number.isFinite(value) && value > 0 ? String(value) : '');
    }
  }, [value, isFocused]);

  const handleTextChange = (text: string) => {
    setTextValue(text);
    const numValue = parseInt(text);
    if (text === '' || isNaN(numValue)) {
      // Don't call onChange immediately when empty - let user finish typing
      if (text !== '') {
        onChange(0);
      }
    } else {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // When user finishes editing, if field is empty, set to 0
    if (textValue === '') {
      onChange(0);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: COLORS.text, fontSize: 14, marginBottom: 4 }}>{label}</Text>
      <TextInput
        style={GlobalStyles.input}
        keyboardType="numeric"
        placeholder={placeholder || ''}
        placeholderTextColor={COLORS.textMuted}
        value={textValue}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text style={{ color: COLORS.text, fontSize: 16 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function Chip({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent + '15',
        borderWidth: 1,
        borderColor: COLORS.accent + '55',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: COLORS.text }}>{text}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={{ marginLeft: 6 }}>
          <Text style={{ color: COLORS.accent, fontWeight: '600' }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Pill({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? COLORS.accent : COLORS.textMuted + '66',
        backgroundColor: active ? COLORS.accent + '20' : 'transparent',
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: active ? COLORS.accent : COLORS.text }}>{text}</Text>
    </TouchableOpacity>
  );
}

function VideoUploadField({ 
  label, 
  videoUrl, 
  onVideoChange, 
  disabled = false 
}: { 
  label: string; 
  videoUrl: string | undefined; 
  onVideoChange: (url: string | undefined) => void; 
  disabled?: boolean; 
}) {
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        setUploading(true);

        // Create a reference to Firebase Storage
        const videoRef = ref(storage, `videos/${Date.now()}_${video.name}`);
        
        // Convert to blob for upload
        const response = await fetch(video.uri);
        const blob = await response.blob();

        // Upload the video
        await uploadBytes(videoRef, blob);
        const downloadURL = await getDownloadURL(videoRef);
        
        onVideoChange(downloadURL);
        Alert.alert('Success', 'Video uploaded successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = async () => {
    if (videoUrl) {
      Alert.alert(
        'Remove Video', 
        'Are you sure you want to remove this video?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                // Try to delete from storage (if it's a firebase URL)
                if (videoUrl.includes('firebase')) {
                  const videoRef = ref(storage, videoUrl);
                  await deleteObject(videoRef).catch(() => {
                    // Ignore errors if file doesn't exist
                  });
                }
                onVideoChange(undefined);
              } catch (error) {
                // Just remove the URL even if deletion fails
                onVideoChange(undefined);
              }
            }
          }
        ]
      );
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: COLORS.text, fontSize: 14, marginBottom: 4 }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TouchableOpacity
          style={[
            GlobalStyles.startButton,
            { 
              flex: 1, 
              backgroundColor: videoUrl ? COLORS.accent : COLORS.textMuted,
              opacity: disabled ? 0.5 : 1
            }
          ]}
          onPress={pickVideo}
          disabled={uploading || disabled}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={GlobalStyles.buttonText}>
              {videoUrl ? 'Replace Video' : 'Upload Video'}
            </Text>
          )}
        </TouchableOpacity>
        
        {videoUrl && (
          <TouchableOpacity
            style={[
              GlobalStyles.startButton,
              { backgroundColor: COLORS.error, paddingHorizontal: 12 }
            ]}
            onPress={removeVideo}
            disabled={disabled}
          >
            <Text style={GlobalStyles.buttonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {videoUrl && (
        <Text style={{ color: COLORS.accent, fontSize: 12, marginTop: 4 }}>
          ✓ Video uploaded
        </Text>
      )}
    </View>
  );
}

/* ───────────────────────── Settings Screen ───────────────────────── */

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
  const [manageExercisesModalVisible, setManageExercisesModalVisible] = useState(false);
  const [editExerciseModalVisible, setEditExerciseModalVisible] = useState(false);

  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Manage modal filters
  const [query, setQuery] = useState('');

  // Available options for tag selection
  const AVAILABLE_SUBCATEGORIES = [
    'Ball Manipulation', 'Ball Striking', 'Speed of Play', 'Crossing', 
    'Finishing', 'Clearances', 'Dribbling', 'Passing/Receiving'
  ];
  
  const AVAILABLE_POSITIONS = [
    'All Positions', 'Attacking Players', 'Center Backs', 
    'Center Midfielders', 'Outside Backs'
  ];

  const [newExercise, setNewExercise] = useState({
    name: '',
    subcategory: '',
    positionCategory: [] as string[],
    setup: '',
    description: '',
    uses_tracking: false,
    max_is_good: false,
    successful_reps: 0,
    sets: 1,
    set_duration: 0,
    rest: 60,
    perFoot: false,
    videoUrls: { default: '', left: '', right: '' },
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        try {
          const token = await getIdTokenResult(firebaseUser, true);
          const adminClaim = !!token.claims.admin;
          const emailOverride = firebaseUser.email === 'samantha.adorno30@gmail.com';
          const adminFlag = adminClaim || emailOverride;
          setIsAdmin(adminFlag);
          console.log('[Settings] Admin check:', {
            email: firebaseUser.email,
            adminClaim,
            emailOverride,
            isAdmin: adminFlag,
          });
        } catch {
          console.log('[Settings] Failed to read admin claim, defaulting to false');
          setIsAdmin(false);
        }
      } else {
        console.log('[Settings] No user signed in, isAdmin = false');
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  /* ───────────── Add / Edit Forms Helpers ───────────── */

  const parsePositions = (raw: string | string[]) =>
    Array.isArray(raw)
      ? raw
      : raw
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);

  const handleAddExercise = async () => {
    if (!newExercise.name.trim() || !newExercise.subcategory.trim()) {
      Alert.alert('Error', 'Name and subcategory are required');
      return;
    }

    if (!newExercise.setup.trim() || !newExercise.description.trim()) {
      Alert.alert('Error', 'Setup instructions and description are required');
      return;
    }

    if (newExercise.positionCategory.length === 0) {
      Alert.alert('Error', 'At least one position must be selected');
      return;
    }

    // Validate required video uploads
    if (newExercise.perFoot) {
      if (!newExercise.videoUrls.left.trim() || !newExercise.videoUrls.right.trim()) {
        Alert.alert('Error', 'Left and Right foot videos are required');
        return;
      }
    } else {
      if (!newExercise.videoUrls.default.trim()) {
        Alert.alert('Error', 'Default video is required');
        return;
      }
    }

    // Validate numeric fields cannot be 0
    if (newExercise.sets <= 0) {
      Alert.alert('Error', 'Sets must be greater than 0');
      return;
    }

    if (newExercise.rest <= 0) {
      Alert.alert('Error', 'Rest time must be greater than 0');
      return;
    }

    // Set duration must be > 0 unless using successful reps for tracking
    const usingSuccessfulReps = newExercise.uses_tracking && newExercise.successful_reps > 0;
    if (!usingSuccessfulReps && newExercise.set_duration <= 0) {
      Alert.alert('Error', 'Set duration must be greater than 0');
      return;
    }

    // Validation rules
    if (newExercise.uses_tracking) {
      const hasSetDuration = newExercise.set_duration > 0;
      const hasSuccessfulReps = newExercise.successful_reps > 0;
      
      if (hasSetDuration && hasSuccessfulReps) {
        Alert.alert('Error', 'Cannot have both Set Duration and Successful Reps. Choose one tracking method.');
        return;
      }
      
      if (!hasSetDuration && !hasSuccessfulReps) {
        Alert.alert('Error', 'When tracking is enabled, you must specify either Set Duration or Successful Reps.');
        return;
      }
    }

    if (newExercise.perFoot && newExercise.sets % 2 !== 0) {
      Alert.alert('Error', 'When "Per Foot" is enabled, sets must be an even number (to work both feet equally).');
      return;
    }

    try {
      setAdding(true);
      
      // Build video URLs object, only including non-empty values
      const videoUrls: any = {};
      if (!newExercise.perFoot && newExercise.videoUrls.default.trim()) {
        videoUrls.default = newExercise.videoUrls.default.trim();
      }
      if (newExercise.perFoot) {
        if (newExercise.videoUrls.left.trim()) {
          videoUrls.left = newExercise.videoUrls.left.trim();
        }
        if (newExercise.videoUrls.right.trim()) {
          videoUrls.right = newExercise.videoUrls.right.trim();
        }
      }

      const exerciseData = {
        ...newExercise,
        name: newExercise.name.trim(),
        subcategory: newExercise.subcategory.trim(),
        positionCategory: newExercise.positionCategory,
        setup: newExercise.setup.trim(),
        description: newExercise.description.trim(),
        uses_tracking: !!newExercise.uses_tracking,
        max_is_good: newExercise.uses_tracking ? !!newExercise.max_is_good : false,
        successful_reps: newExercise.uses_tracking ? (Number(newExercise.successful_reps) || 0) : 0,
        sets: Number(newExercise.sets) || 1,
        set_duration: Number(newExercise.set_duration) || 0, // Allow set_duration even when tracking is off
        rest: Number(newExercise.rest) || 60,
        perFoot: !!newExercise.perFoot,
        videoUrls: Object.keys(videoUrls).length > 0 ? videoUrls : undefined,
      };

      await addDoc(collection(db, 'exercises'), exerciseData);
      Alert.alert('Success', 'Exercise added successfully');

      // Reset form
      setNewExercise({
        name: '',
        subcategory: '',
        positionCategory: [],
        setup: '',
        description: '',
        uses_tracking: false,
        max_is_good: false,
        successful_reps: 0,
        sets: 1,
        set_duration: 0,
        rest: 60,
        perFoot: false,
        videoUrls: { default: '', left: '', right: '' },
      });
      setAddExerciseModalVisible(false);
      await loadExercises(); // keep list fresh if manage is open later
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to add exercise');
    } finally {
      setAdding(false);
    }
  };

  const handleEditExercise = (exercise: any) => {
    setSelectedExercise({
      ...exercise,
      setup: exercise.setup || '',
      description: exercise.description || '',
      uses_tracking: !!exercise.uses_tracking,
      max_is_good: !!exercise.max_is_good,
      successful_reps: Number(exercise.successful_reps) || 0,
      set_duration: Number(exercise.set_duration) || 0,
      perFoot: !!exercise.perFoot,
      positionCategory: Array.isArray(exercise.positionCategory) 
        ? exercise.positionCategory 
        : exercise.positionCategory ? [exercise.positionCategory] : [],
      videoUrls: exercise.videoUrls || { default: '', left: '', right: '' },
    });
    setManageExercisesModalVisible(false);
    setTimeout(() => setEditExerciseModalVisible(true), 100);
  };

  const handleUpdateExercise = async () => {
    if (!selectedExercise?.name?.trim() || !selectedExercise?.subcategory?.trim()) {
      Alert.alert('Error', 'Name and subcategory are required');
      return;
    }

    if (!selectedExercise?.setup?.trim() || !selectedExercise?.description?.trim()) {
      Alert.alert('Error', 'Setup instructions and description are required');
      return;
    }

    if (!selectedExercise.positionCategory || selectedExercise.positionCategory.length === 0) {
      Alert.alert('Error', 'At least one position must be selected');
      return;
    }

    // Validate required video uploads
    if (selectedExercise.perFoot) {
      if (!selectedExercise.videoUrls?.left?.trim() || !selectedExercise.videoUrls?.right?.trim()) {
        Alert.alert('Error', 'Left and Right foot videos are required');
        return;
      }
    } else {
      if (!selectedExercise.videoUrls?.default?.trim()) {
        Alert.alert('Error', 'Default video is required');
        return;
      }
    }

    // Validate numeric fields cannot be 0
    if (selectedExercise.sets <= 0) {
      Alert.alert('Error', 'Sets must be greater than 0');
      return;
    }

    if (selectedExercise.rest <= 0) {
      Alert.alert('Error', 'Rest time must be greater than 0');
      return;
    }

    // Set duration must be > 0 unless using successful reps for tracking
    const usingSuccessfulReps = selectedExercise.uses_tracking && selectedExercise.successful_reps > 0;
    if (!usingSuccessfulReps && selectedExercise.set_duration <= 0) {
      Alert.alert('Error', 'Set duration must be greater than 0');
      return;
    }

    // Validation rules
    if (selectedExercise.uses_tracking) {
      const hasSetDuration = selectedExercise.set_duration > 0;
      const hasSuccessfulReps = selectedExercise.successful_reps > 0;
      
      if (hasSetDuration && hasSuccessfulReps) {
        Alert.alert('Error', 'Cannot have both Set Duration and Successful Reps. Choose one tracking method.');
        return;
      }
      
      if (!hasSetDuration && !hasSuccessfulReps) {
        Alert.alert('Error', 'When tracking is enabled, you must specify either Set Duration or Successful Reps.');
        return;
      }
    }

    if (selectedExercise.perFoot && selectedExercise.sets % 2 !== 0) {
      Alert.alert('Error', 'When "Per Foot" is enabled, sets must be an even number (to work both feet equally).');
      return;
    }

    try {
      setAdding(true);
      
      // Build video URLs object, only including non-empty values
      const videoUrls: any = {};
      if (!selectedExercise.perFoot && selectedExercise.videoUrls?.default?.trim()) {
        videoUrls.default = selectedExercise.videoUrls.default.trim();
      }
      if (selectedExercise.perFoot) {
        if (selectedExercise.videoUrls?.left?.trim()) {
          videoUrls.left = selectedExercise.videoUrls.left.trim();
        }
        if (selectedExercise.videoUrls?.right?.trim()) {
          videoUrls.right = selectedExercise.videoUrls.right.trim();
        }
      }

      const exerciseData = {
        ...selectedExercise,
        name: selectedExercise.name.trim(),
        subcategory: selectedExercise.subcategory.trim(),
        positionCategory: Array.isArray(selectedExercise.positionCategory)
          ? selectedExercise.positionCategory
          : [selectedExercise.positionCategory],
        setup: selectedExercise.setup?.trim() || '',
        description: selectedExercise.description?.trim() || '',
        uses_tracking: !!selectedExercise.uses_tracking,
        max_is_good: selectedExercise.uses_tracking ? !!selectedExercise.max_is_good : false,
        successful_reps: selectedExercise.uses_tracking ? (Number(selectedExercise.successful_reps) || 0) : 0,
        sets: Number(selectedExercise.sets) || 1,
        set_duration: Number(selectedExercise.set_duration) || 0, // Allow set_duration even when tracking is off
        rest: Number(selectedExercise.rest) || 60,
        perFoot: !!selectedExercise.perFoot,
        videoUrls: Object.keys(videoUrls).length > 0 ? videoUrls : undefined,
      };

      await updateDoc(doc(db, 'exercises', selectedExercise.id), exerciseData);
      Alert.alert('Success', 'Exercise updated successfully');
      setEditExerciseModalVisible(false);
      await loadExercises();
      setTimeout(() => setManageExercisesModalVisible(true), 100);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update exercise');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    Alert.alert('Delete Exercise', 'Are you sure you want to delete this exercise?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'exercises', exerciseId));
            Alert.alert('Success', 'Exercise deleted successfully');
            await loadExercises();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete exercise');
          }
        },
      },
    ]);
  };

  const loadExercises = async () => {
    try {
      setLoadingExercises(true);
      const colRef = collection(db, 'exercises');
      const snap = await getDocs(colRef);
      const exercisesList = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
      // sort by name asc for stable browsing
      exercisesList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setExercises(exercisesList);
    } catch {
      Alert.alert('Error', 'Failed to load exercises');
    } finally {
      setLoadingExercises(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  // Filtered list for Manage modal
  const filtered = useMemo(() => {
    let list = exercises;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((x) => {
        const pos = Array.isArray(x.positionCategory) ? x.positionCategory.join(', ') : x.positionCategory || '';
        return (
          (x.name || '').toLowerCase().includes(q) ||
          (x.subcategory || '').toLowerCase().includes(q) ||
          pos.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [exercises, query]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  /* ────────────────────────────── UI ────────────────────────────── */

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <Text style={GlobalStyles.header}>Settings</Text>
      </View>

      {user ? (
        <>
          <Text style={GlobalStyles.email}>Logged in as: {user.email}</Text>
          <Text style={GlobalStyles.email}>Admin: {isAdmin ? 'Yes' : 'No'}</Text>

          {isAdmin && (
            <>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={[GlobalStyles.startButton, { backgroundColor: COLORS.accent, flexGrow: 1 }]}
                  onPress={() => setAddExerciseModalVisible(true)}
                >
                  <Text style={GlobalStyles.buttonText}>Add Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[GlobalStyles.startButton, { backgroundColor: COLORS.accent, flexGrow: 1 }]}
                  onPress={() => {
                    setManageExercisesModalVisible(true);
                    loadExercises();
                  }}
                >
                  <Text style={GlobalStyles.buttonText}>Manage</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity style={[GlobalStyles.startButton, { marginTop: 12 }]} onPress={handleSignOut}>
            <Text style={GlobalStyles.buttonText}>Sign Out</Text>
          </TouchableOpacity>

          {/* ───────── Add Exercise Modal ───────── */}
          <Modal visible={addExerciseModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
              <ScrollView style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: 20, maxHeight: '85%' }}>
                    <Text style={[GlobalStyles.header, { marginBottom: 4, textAlign: 'center' }]}>Add Exercise</Text>
                    <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginBottom: 16 }}>
                      Keep names short and clear
                    </Text>

                    <SectionTitle>Basic Info</SectionTitle>
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 12 }]}
                      placeholder="Exercise Name *"
                      placeholderTextColor={COLORS.textMuted}
                      value={newExercise.name}
                      onChangeText={(t) => setNewExercise((p) => ({ ...p, name: t }))}
                    />

                    <Text style={{ color: COLORS.text, marginBottom: 6 }}>Subcategory *</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                      {AVAILABLE_SUBCATEGORIES.map((subcat) => (
                        <Pill
                          key={subcat}
                          text={subcat}
                          active={newExercise.subcategory === subcat}
                          onPress={() => setNewExercise((p) => ({ ...p, subcategory: subcat }))}
                        />
                      ))}
                    </View>

                    <Text style={{ color: COLORS.text, marginBottom: 6 }}>Positions *</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                      {newExercise.positionCategory.map((pos, i) => (
                        <Chip
                          key={`${pos}-${i}`}
                          text={pos}
                          onRemove={() =>
                            setNewExercise((p) => ({
                              ...p,
                              positionCategory: p.positionCategory.filter((x) => x !== pos),
                            }))
                          }
                        />
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                      {AVAILABLE_POSITIONS.map((pos) => {
                        const isSelected = newExercise.positionCategory.includes(pos);
                        return (
                          <Pill
                            key={pos}
                            text={pos}
                            active={isSelected}
                            onPress={() =>
                              setNewExercise((p) => ({
                                ...p,
                                positionCategory: isSelected 
                                  ? p.positionCategory.filter((x) => x !== pos)
                                  : [...p.positionCategory, pos],
                              }))
                            }
                          />
                        );
                      })}
                    </View>

                    <SectionTitle>Instructions</SectionTitle>
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 12, height: 80, textAlignVertical: 'top' }]}
                      placeholder="Setup instructions *"
                      placeholderTextColor={COLORS.textMuted}
                      multiline
                      numberOfLines={4}
                      value={newExercise.setup}
                      onChangeText={(t) => setNewExercise((p) => ({ ...p, setup: t }))}
                    />
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 8, height: 80, textAlignVertical: 'top' }]}
                      placeholder="Description *"
                      placeholderTextColor={COLORS.textMuted}
                      multiline
                      numberOfLines={4}
                      value={newExercise.description}
                      onChangeText={(t) => setNewExercise((p) => ({ ...p, description: t }))}
                    />

                    <SectionTitle>Exercise Config</SectionTitle>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                      <LabeledNumber 
                        label={newExercise.perFoot ? "Sets (must be even)" : "Sets"} 
                        value={newExercise.sets} 
                        onChange={(n) => setNewExercise((p) => ({ ...p, sets: n || 1 }))} 
                      />
                      <LabeledNumber
                        label="Rest (s)"
                        value={newExercise.rest}
                        onChange={(n) => setNewExercise((p) => ({ ...p, rest: n || 60 }))}
                      />
                    </View>
                    
                    {newExercise.perFoot && newExercise.sets % 2 !== 0 && (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                        ⚠️ Per Foot exercises need even sets (e.g., 2, 4, 6) to work both feet equally
                      </Text>
                    )}

                    {/* Always show Set Duration, but grouped with tracking options when tracking is enabled */}
                    {!newExercise.uses_tracking && (
                      <View style={{ marginBottom: 12 }}>
                        <LabeledNumber
                          label="Set Duration (s)"
                          value={newExercise.set_duration}
                          onChange={(n) => setNewExercise((p) => ({ ...p, set_duration: n || 0 }))}
                        />
                      </View>
                    )}

                    <SectionTitle>Tracking Options</SectionTitle>
                    <ToggleRow
                      label="Uses Tracking"
                      value={newExercise.uses_tracking}
                      onValueChange={(v) => setNewExercise((p) => ({ 
                        ...p, 
                        uses_tracking: v,
                        max_is_good: v ? p.max_is_good : false,
                        successful_reps: v ? p.successful_reps : 0
                      }))}
                    />

                    {newExercise.uses_tracking && (
                      <>
                        <Text style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 8, fontStyle: 'italic' }}>
                          Choose ONE tracking method:
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                          <LabeledNumber
                            label="Successful Reps"
                            value={newExercise.successful_reps}
                            onChange={(n) => setNewExercise((p) => ({ ...p, successful_reps: n || 0, set_duration: n > 0 ? 0 : p.set_duration }))}
                          />
                          <LabeledNumber
                            label="Set Duration (s)"
                            value={newExercise.set_duration}
                            onChange={(n) => setNewExercise((p) => ({ ...p, set_duration: n || 0, successful_reps: n > 0 ? 0 : p.successful_reps }))}
                          />
                        </View>
                        
                        {newExercise.set_duration > 0 && newExercise.successful_reps > 0 && (
                          <Text style={{ color: COLORS.error, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                            ⚠️ Choose either Set Duration OR Successful Reps, not both
                          </Text>
                        )}

                        <ToggleRow
                          label="Max is Good"
                          value={newExercise.max_is_good}
                          onValueChange={(v) => setNewExercise((p) => ({ ...p, max_is_good: v }))}
                        />
                      </>
                    )}

                    <ToggleRow
                      label="Per Foot"
                      value={newExercise.perFoot}
                      onValueChange={(v) => setNewExercise((p) => ({ ...p, perFoot: v }))}
                    />

                    <SectionTitle>Videos</SectionTitle>
                    {!newExercise.perFoot && (
                      <VideoUploadField
                        label="Default Video *"
                        videoUrl={newExercise.videoUrls.default}
                        onVideoChange={(url) => setNewExercise((p) => ({ ...p, videoUrls: { ...p.videoUrls, default: url || '' } }))}
                        disabled={adding}
                      />
                    )}
                    {newExercise.perFoot && (
                      <>
                        <VideoUploadField
                          label="Left Foot Video *"
                          videoUrl={newExercise.videoUrls.left}
                          onVideoChange={(url) => setNewExercise((p) => ({ ...p, videoUrls: { ...p.videoUrls, left: url || '' } }))}
                          disabled={adding}
                        />
                        <VideoUploadField
                          label="Right Foot Video *"
                          videoUrl={newExercise.videoUrls.right}
                          onVideoChange={(url) => setNewExercise((p) => ({ ...p, videoUrls: { ...p.videoUrls, right: url || '' } }))}
                          disabled={adding}
                        />
                      </>
                    )}

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                        style={[GlobalStyles.startButton, { flex: 1, backgroundColor: COLORS.textMuted }]}
                        onPress={() => setAddExerciseModalVisible(false)}
                        disabled={adding}
                      >
                        <Text style={GlobalStyles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[GlobalStyles.startButton, { flex: 1 }]}
                        onPress={handleAddExercise}
                        disabled={adding}
                      >
                        {adding ? <ActivityIndicator color="#fff" /> : <Text style={GlobalStyles.buttonText}>Add Exercise</Text>}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
              </View>
          </Modal>

          {/* ───────── Manage Exercises Modal (simplified card list + filters) ───────── */}
          <Modal visible={manageExercisesModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
              <View style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: 20, maxHeight: '85%', flex: 1 }}>
                    <Text style={[GlobalStyles.header, { marginBottom: 6 }]}>Manage Exercises</Text>

                    {/* Search */}
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 16 }]}
                      placeholder="Search by name, subcategory, or position"
                      placeholderTextColor={COLORS.textMuted}
                      value={query}
                      onChangeText={setQuery}
                    />

                    {loadingExercises ? (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.accent} />
                        <Text style={[GlobalStyles.email, { marginTop: 10 }]}>Loading exercises...</Text>
                      </View>
                    ) : (
                      <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        style={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={
                          <Text style={[GlobalStyles.email, { textAlign: 'center', color: COLORS.textMuted, padding: 20 }]}>
                            No exercises found
                          </Text>
                        }
                        renderItem={({ item }) => {
                          return (
                            <View
                              style={{
                                paddingVertical: 16,
                                paddingHorizontal: 4,
                                borderBottomWidth: 1,
                                borderBottomColor: COLORS.textMuted + '15',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={{ 
                                  color: COLORS.text, 
                                  fontWeight: '600', 
                                  fontSize: 16,
                                  lineHeight: 22
                                }} numberOfLines={1}>
                                  {item.name}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                  onPress={() => handleEditExercise(item)}
                                  style={{ 
                                    paddingHorizontal: 16, 
                                    paddingVertical: 10, 
                                    backgroundColor: COLORS.accent, 
                                    borderRadius: 8,
                                    minWidth: 60,
                                    alignItems: 'center'
                                  }}
                                >
                                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDeleteExercise(item.id)}
                                  style={{ 
                                    paddingHorizontal: 16, 
                                    paddingVertical: 10, 
                                    backgroundColor: COLORS.error, 
                                    borderRadius: 8,
                                    minWidth: 60,
                                    alignItems: 'center'
                                  }}
                                >
                                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        }}
                      />
                    )}

                    <TouchableOpacity
                      style={[GlobalStyles.startButton, { marginTop: 12, backgroundColor: COLORS.textMuted }]}
                      onPress={() => setManageExercisesModalVisible(false)}
                    >
                      <Text style={GlobalStyles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
              </View>
          </Modal>

          {/* ───────── Edit Exercise Modal ───────── */}
          <Modal visible={editExerciseModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
              <ScrollView style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: 20, maxHeight: '85%' }}>
                    <Text style={[GlobalStyles.header, { marginBottom: 4, textAlign: 'center' }]}>Edit Exercise</Text>
                    {selectedExercise && (
                      <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
                        Editing: {selectedExercise.name}
                      </Text>
                    )}

                    <SectionTitle>Basic Info</SectionTitle>
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 12 }]}
                      placeholder="Exercise Name *"
                      value={selectedExercise?.name || ''}
                      onChangeText={(t) => setSelectedExercise((p: any) => ({ ...p, name: t }))}
                      placeholderTextColor={COLORS.textMuted}
                    />

                    <Text style={{ color: COLORS.text, marginBottom: 6 }}>Subcategory *</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                      {AVAILABLE_SUBCATEGORIES.map((subcat) => (
                        <Pill
                          key={subcat}
                          text={subcat}
                          active={selectedExercise?.subcategory === subcat}
                          onPress={() => setSelectedExercise((p: any) => ({ ...p, subcategory: subcat }))}
                        />
                      ))}
                    </View>

                    <Text style={{ color: COLORS.text, marginBottom: 6 }}>Positions *</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                      {(Array.isArray(selectedExercise?.positionCategory)
                        ? selectedExercise.positionCategory
                        : selectedExercise?.positionCategory ? [selectedExercise.positionCategory] : []
                      ).map((pos: string, i: number) => (
                        <Chip
                          key={`${pos}-${i}`}
                          text={pos}
                          onRemove={() =>
                            setSelectedExercise((p: any) => ({
                              ...p,
                              positionCategory: (Array.isArray(p.positionCategory) ? p.positionCategory : [p.positionCategory]).filter((x: string) => x !== pos),
                            }))
                          }
                        />
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                      {AVAILABLE_POSITIONS.map((pos) => {
                        const currentPositions = Array.isArray(selectedExercise?.positionCategory)
                          ? selectedExercise.positionCategory
                          : selectedExercise?.positionCategory ? [selectedExercise.positionCategory] : [];
                        const isSelected = currentPositions.includes(pos);
                        return (
                          <Pill
                            key={pos}
                            text={pos}
                            active={isSelected}
                            onPress={() =>
                              setSelectedExercise((p: any) => ({
                                ...p,
                                positionCategory: isSelected
                                  ? (Array.isArray(p.positionCategory) ? p.positionCategory : [p.positionCategory]).filter((x: string) => x !== pos)
                                  : [
                                      ...(Array.isArray(p.positionCategory) ? p.positionCategory : p.positionCategory ? [p.positionCategory] : []),
                                      pos
                                    ],
                              }))
                            }
                          />
                        );
                      })}
                    </View>

                    <SectionTitle>Instructions</SectionTitle>
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 12, height: 80, textAlignVertical: 'top' }]}
                      placeholder="Setup instructions *"
                      value={selectedExercise?.setup || ''}
                      onChangeText={(t) => setSelectedExercise((p: any) => ({ ...p, setup: t }))}
                      multiline
                      numberOfLines={4}
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <TextInput
                      style={[GlobalStyles.input, { marginBottom: 8, height: 80, textAlignVertical: 'top' }]}
                      placeholder="Description *"
                      value={selectedExercise?.description || ''}
                      onChangeText={(t) => setSelectedExercise((p: any) => ({ ...p, description: t }))}
                      multiline
                      numberOfLines={4}
                      placeholderTextColor={COLORS.textMuted}
                    />

                    <SectionTitle>Exercise Config</SectionTitle>
                    <View style={{ flexDirection: 'row', marginBottom: 12, gap: 12 }}>
                      <LabeledNumber
                        label={selectedExercise?.perFoot ? "Sets (must be even)" : "Sets"}
                        value={selectedExercise?.sets || 0}
                        onChange={(n) => setSelectedExercise((p: any) => ({ ...p, sets: n || 1 }))}
                      />
                      <LabeledNumber
                        label="Rest (s)"
                        value={selectedExercise?.rest || 0}
                        onChange={(n) => setSelectedExercise((p: any) => ({ ...p, rest: n || 60 }))}
                      />
                    </View>
                    
                    {selectedExercise?.perFoot && selectedExercise?.sets % 2 !== 0 && (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                        ⚠️ Per Foot exercises need even sets (e.g., 2, 4, 6) to work both feet equally
                      </Text>
                    )}

                    {/* Always show Set Duration, but grouped with tracking options when tracking is enabled */}
                    {!selectedExercise?.uses_tracking && (
                      <View style={{ marginBottom: 12 }}>
                        <LabeledNumber
                          label="Set Duration (s)"
                          value={selectedExercise?.set_duration || 0}
                          onChange={(n) => setSelectedExercise((p: any) => ({ ...p, set_duration: n || 0 }))}
                        />
                      </View>
                    )}

                    <SectionTitle>Tracking Options</SectionTitle>
                    <ToggleRow
                      label="Uses Tracking"
                      value={!!selectedExercise?.uses_tracking}
                      onValueChange={(v) => setSelectedExercise((p: any) => ({ 
                        ...p, 
                        uses_tracking: v,
                        max_is_good: v ? p.max_is_good : false,
                        successful_reps: v ? p.successful_reps : 0
                      }))}
                    />

                    {selectedExercise?.uses_tracking && (
                      <>
                        <Text style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 8, fontStyle: 'italic' }}>
                          Choose ONE tracking method:
                        </Text>
                        <View style={{ flexDirection: 'row', marginBottom: 12, gap: 12 }}>
                          <LabeledNumber
                            label="Successful Reps"
                            value={selectedExercise?.successful_reps || 0}
                            onChange={(n) => setSelectedExercise((p: any) => ({ ...p, successful_reps: n || 0, set_duration: n > 0 ? 0 : p.set_duration }))}
                          />
                          <LabeledNumber
                            label="Set Duration (s)"
                            value={selectedExercise?.set_duration || 0}
                            onChange={(n) => setSelectedExercise((p: any) => ({ ...p, set_duration: n || 0, successful_reps: n > 0 ? 0 : p.successful_reps }))}
                          />
                        </View>
                        
                        {selectedExercise?.set_duration > 0 && selectedExercise?.successful_reps > 0 && (
                          <Text style={{ color: COLORS.error, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                            ⚠️ Choose either Set Duration OR Successful Reps, not both
                          </Text>
                        )}

                        <ToggleRow
                          label="Max is Good"
                          value={!!selectedExercise?.max_is_good}
                          onValueChange={(v) => setSelectedExercise((p: any) => ({ ...p, max_is_good: v }))}
                        />
                      </>
                    )}

                    <ToggleRow
                      label="Per Foot"
                      value={!!selectedExercise?.perFoot}
                      onValueChange={(v) => setSelectedExercise((p: any) => ({ ...p, perFoot: v }))}
                    />

                    <SectionTitle>Videos (Required)</SectionTitle>
                    {!selectedExercise?.perFoot && (
                      <VideoUploadField
                        label="Default Video *"
                        videoUrl={selectedExercise?.videoUrls?.default}
                        onVideoChange={(url) =>
                          setSelectedExercise((p: any) => ({ ...p, videoUrls: { ...p?.videoUrls, default: url || '' } }))
                        }
                        disabled={adding}
                      />
                    )}
                    {selectedExercise?.perFoot && (
                      <>
                        <VideoUploadField
                          label="Left Foot Video *"
                          videoUrl={selectedExercise?.videoUrls?.left}
                          onVideoChange={(url) => setSelectedExercise((p: any) => ({ ...p, videoUrls: { ...p?.videoUrls, left: url || '' } }))}
                          disabled={adding}
                        />
                        <VideoUploadField
                          label="Right Foot Video *"
                          videoUrl={selectedExercise?.videoUrls?.right}
                          onVideoChange={(url) =>
                            setSelectedExercise((p: any) => ({ ...p, videoUrls: { ...p?.videoUrls, right: url || '' } }))
                          }
                          disabled={adding}
                        />
                      </>
                    )}

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                        style={[GlobalStyles.startButton, { flex: 1, backgroundColor: COLORS.textMuted }]}
                        onPress={() => {
                          setEditExerciseModalVisible(false);
                          setTimeout(() => setManageExercisesModalVisible(true), 100);
                        }}
                      >
                        <Text style={GlobalStyles.buttonText}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[GlobalStyles.startButton, { flex: 1 }]}
                        onPress={handleUpdateExercise}
                        disabled={adding}
                      >
                        {adding ? <ActivityIndicator color="#fff" /> : <Text style={GlobalStyles.buttonText}>Update</Text>}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
              </View>
          </Modal>
        </>
      ) : (
        <Text style={GlobalStyles.email}>You are not logged in.</Text>
      )}
    </View>
  );
}
