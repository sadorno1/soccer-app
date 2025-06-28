import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '@/constants/Colors';

export default function ReturnButton() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()} style={styles.returnBtn}>
      <Text style={styles.returnText}>Return</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  returnBtn: {
    alignSelf: 'flex-start',
    margin: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  returnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
