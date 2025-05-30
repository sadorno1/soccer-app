// app/(tabs)/select-position.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/Colors';

const positions = [
  { key: 'attacking-players',   label: 'Attacking\nPlayers' },
  { key: 'center-midfielders',  label: 'Center\nMidfielders' },
  { key: 'center-backs',        label: 'Center\nBacks' },
  { key: 'outside-backs',       label: 'Outside\nBacks' },
];

export default function SelectPositionScreen() {
  const router = useRouter();
  const { target } = useLocalSearchParams<{ target?: string }>();

  const selectPosition = (pos: string) => {
    router.push({
      pathname: '/exercises/[position]',
      params: { position: pos, workoutId: target },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Position</Text>
      <View style={styles.fieldGrid}>
        {positions.map((p) => (
          <Pressable
            key={p.key}
            style={styles.circle}
            onPress={() => selectPosition(p.key)}
          >
            <Text style={styles.circleText}>{p.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.allBtn}
        onPress={() => selectPosition('all-positions')}
      >
        <Text style={styles.allText}>All Positions</Text>
      </Pressable>
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
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 20,

  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 24,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  allBtn: {
    marginTop: 32,
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  allText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
