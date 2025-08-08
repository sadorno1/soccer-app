// app/(tabs)/exercises.tsx
import ExerciseCard from '@/components/ExerciseCard';
import { COLORS } from '@/constants/Colors';
import { sampleExercises } from '@/data/sampleExercises';
import { GlobalStyles, SIZES } from '@/theme';
import { useRef, useState } from 'react';
import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Exercise {
  id: string;
  name: string;
  subcategory: string;
  positionCategory: string[];
  setup: string;
  description: string;
  uses_tracking: boolean;
  sets: number;
  set_duration: number;
  rest: number;
  perFoot?: boolean;
  videoUrls: {
    default?: string;
    left?: string;
    right?: string;
  };
}

/* ---------- helper maps ---------- */
const SUBCATEGORY_COLORS: Record<string, string> = {
  'Ball Manipulation': '#FFA726',
  Dribbling: '#66BB6A',
  Crossing: '#42A5F5',
  Finishing: '#EF5350',
  'Ball Striking': '#AB47BC',
  Clearances: '#8D6E63',
  'Passing/Receiving': '#26A69A',
  'Speed of Play': '#78909C',
  Juggling: '#FFCA28',
};

// Position categories for filtering
const positions = ['All Positions', 'Attacking Players', 'Center Midfielders', 'Center Backs', 'Outside Backs'];

export default function Exercises() {
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedVideos, setExpandedVideos] = useState<{[key: string]: boolean}>({});
  const flatListRef = useRef<FlatList>(null);

  // Filter exercises by position
  const filteredExercises = sampleExercises.filter(exercise => 
    selectedPosition === 'All Positions' || exercise.positionCategory.includes(selectedPosition)
  );

  // Sort exercises by subcategory then name
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (a.subcategory !== b.subcategory) {
      return a.subcategory.localeCompare(b.subcategory);
    }
    return a.name.localeCompare(b.name);
  });

  const ExerciseModal = ({ exercise, visible, onClose }: { exercise: Exercise | null, visible: boolean, onClose: () => void }) => {
    const toggleVideo = (videoType: string) => {
      setExpandedVideos(prev => ({
        ...prev,
        [videoType]: !prev[videoType]
      }));
    };

    const openVideo = (url: string) => {
      Linking.openURL(url);
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <SafeAreaView style={[GlobalStyles.screen, { backgroundColor: COLORS.background }]}>
          <View style={[GlobalStyles.headerRow, { paddingTop: SIZES.md, paddingHorizontal: SIZES.lg }]}>
            <Pressable onPress={onClose}
              style={({ pressed }) => [
                GlobalStyles.add_back_Button,
                { 
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  shadowOpacity: pressed ? 0.3 : 0.2,
                  marginLeft: SIZES.md,
                  marginTop: SIZES.sm,
                }
              ]}
            >
              <Text style={GlobalStyles.add_backText}>{'←'}</Text>
              
            </Pressable>
            <Text style={[GlobalStyles.title, { flex: 1, marginLeft: SIZES.md, marginTop: SIZES.sm }]}>{exercise?.name}</Text>
          </View>
        
        <ScrollView style={GlobalStyles.container}>
          {/* Positions */}
          <View style={styles.positionsSection}>
            <Text style={GlobalStyles.sectionTitle}>Positions:</Text>
            <View style={styles.positionsList}>
              {exercise?.positionCategory.map((position: string, index: number) => (
                <View key={index} style={styles.positionBadge}>
                  <Text style={styles.positionText}>{position}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={GlobalStyles.sectionTitle}>Description</Text>
            <Text style={[GlobalStyles.paragraph, { color: COLORS.text }]}>{exercise?.description}</Text>
          </View>

          {/* Setup */}
          <View style={styles.section}>
            <Text style={GlobalStyles.sectionTitle}>Setup</Text>
            <Text style={[GlobalStyles.paragraph, { color: COLORS.text }]}>{exercise?.setup}</Text>
          </View>

          {/* Video Resources */}
          {(exercise?.videoUrls.default || exercise?.videoUrls.left || exercise?.videoUrls.right) && (
            <View style={styles.section}>
              <Text style={GlobalStyles.sectionTitle}>Video Resources</Text>
              {exercise?.videoUrls.default && (
                <View>
                  <Pressable 
                    style={[styles.videoButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => toggleVideo('default')}
                  >
                    <Text style={styles.videoButtonText}>
                      📹 Default Video {expandedVideos.default ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {expandedVideos.default && (
                    <View style={styles.videoContent}>
                      <Text style={styles.videoNote}>Video shows standard technique</Text>
                      <Pressable 
                        style={[styles.watchButton, { backgroundColor: COLORS.primary }]}
                        onPress={() => openVideo(exercise?.videoUrls.default || '')}
                      >
                        <Text style={styles.watchButtonText}>▶️ Watch Video</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
              {exercise?.videoUrls.left && (
                <View>
                  <Pressable 
                    style={[styles.videoButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => toggleVideo('left')}
                  >
                    <Text style={styles.videoButtonText}>
                      📹 Left Foot Video {expandedVideos.left ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {expandedVideos.left && (
                    <View style={styles.videoContent}>
                      <Text style={styles.videoNote}>Video demonstrates left foot technique</Text>
                      <Pressable 
                        style={[styles.watchButton, { backgroundColor: COLORS.success }]}
                        onPress={() => openVideo(exercise?.videoUrls.left || '')}
                      >
                        <Text style={styles.watchButtonText}>▶️ Watch Video</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
              {exercise?.videoUrls.right && (
                <View>
                  <Pressable 
                    style={[styles.videoButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => toggleVideo('right')}
                  >
                    <Text style={styles.videoButtonText}>
                      📹 Right Foot Video {expandedVideos.right ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {expandedVideos.right && (
                    <View style={styles.videoContent}>
                      <Text style={styles.videoNote}>Video demonstrates right foot technique</Text>
                      <Pressable 
                        style={[styles.watchButton, { backgroundColor: COLORS.error }]}
                        onPress={() => openVideo(exercise?.videoUrls.right || '')}
                      >
                        <Text style={styles.watchButtonText}>▶️ Watch Video</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
        <Text style={GlobalStyles.header}>All Exercises</Text>
      </View>
      
      {/* Position Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterWrapper}>
          {positions.map((position) => (
            <TouchableOpacity
              key={position}
              style={[
                styles.filterButton,
                selectedPosition === position && styles.filterButtonActive
              ]}
              onPress={() => {
                setSelectedPosition(position);
                // Scroll to top when filter changes
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            >
              <Text style={[
                styles.filterButtonText,
                selectedPosition === position && styles.filterButtonTextActive
              ]}>
                {position}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Exercise Cards */}
      <FlatList
        ref={flatListRef}
        data={sortedExercises}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ExerciseCard
            name={item.name}
            subcategory={item.subcategory}
            color={SUBCATEGORY_COLORS[item.subcategory] ?? COLORS.primary}
            onPress={() => {
              setSelectedExercise(item);
              setModalVisible(true);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Exercise Detail Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = {
  filterContainer: {
    marginBottom: SIZES.lg,
  },
  filterWrapper: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SIZES.sm,
    justifyContent: 'center' as const,
  },
  filterButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    lineHeight: SIZES.body * 1.2,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  positionsSection: {
    marginBottom: SIZES.lg,
  },
  positionsList: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  positionBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  positionText: {
    color: COLORS.primary,
    fontSize: SIZES.caption,
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  videoButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: SIZES.body,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  videoContent: {
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    marginTop: 4,
    marginBottom: SIZES.sm,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  videoUrl: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  videoNote: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    fontStyle: 'italic' as const,
    marginBottom: SIZES.sm,
  },
  watchButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
    alignItems: 'center' as const,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: SIZES.body,
    fontWeight: '600' as const,
  },
};
