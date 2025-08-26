import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import Theme, { SIZES, scale, verticalScale, GlobalStyles } from '@/theme';


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
    router.replace({
      pathname: '/exercises/[position]',
      params: { position: pos, workoutId: target },
    });
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerRow}>
         
      <Text style={GlobalStyles.header}>Select Position</Text>
        
      </View>

      <View style={GlobalStyles.fieldGrid}>
        {positions.map((p) => (
          <Pressable
            key={p.key}
            style={GlobalStyles.circle}
            onPress={() => selectPosition(p.key)}
          >
            <Text style={GlobalStyles.circleText}>{p.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={GlobalStyles.allBtn}
        onPress={() => selectPosition('all-positions')}
      >
        <Text style={GlobalStyles.allText}>All Positions</Text>
      </Pressable>
    </View>
  );
}

