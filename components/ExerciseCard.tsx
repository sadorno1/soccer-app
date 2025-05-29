// src/components/ExerciseCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface ExerciseCardProps {
  name: string;
  subcategory: string;
  sets?: number;
  reps?: number;
  weight?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  color?: string;
}

export default function ExerciseCard({
  name,
  subcategory,
  sets,
  reps,
  weight,
  onPress,
  onLongPress,
  color,
}: ExerciseCardProps) {
  const tagColor =
    color ??
    (COLORS.subcategories as Record<string, string>)[subcategory.toLowerCase()] ??
    '#475569';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.card}
    >
      <View>
        <Text style={styles.name}>{name}</Text>
        {(sets && reps) && (
          <Text style={styles.details}>
            {sets} sets • {reps} reps{weight ? ` • ${weight}` : ''}
          </Text>
        )}
      </View>
      <Text style={[styles.tag, { backgroundColor: tagColor }]}>
        {subcategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    margin: 8,
    flex: 1,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    fontSize: 13,
    color: '#cbd5e1', // lighter detail text
    fontWeight: '500',
    marginBottom: 8,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    color: COLORS.text,
    overflow: 'hidden',
    fontWeight: '500',
  },
});
