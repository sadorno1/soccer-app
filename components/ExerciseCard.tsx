// src/components/ExerciseCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface ExerciseCardProps {
  name: string;
  subcategory: string;
  onPress?: () => void;
  /** optional color sent by the list screen */
  color?: string;
}

export default function ExerciseCard({
  name,
  subcategory,
  onPress,
  color,
}: ExerciseCardProps) {
  // fallback to color map if no prop is supplied
  const tagColor =
    color ??
    (COLORS.subcategories as Record<string, string>)[subcategory.toLowerCase()] ??
    '#475569';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{name}</Text>
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
