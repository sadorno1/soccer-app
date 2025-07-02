// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: 'transparent',
          height: 80,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'home-outline',
            exercises: 'barbell-outline',
            records: 'stats-chart-outline',
            settings: 'settings-outline',
          };
          return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      {/* real tabs */}
      <Tabs.Screen name="index"     options={{ title: 'Home' }} />
      <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
      <Tabs.Screen name="records"   options={{ title: 'Records' }} />
      <Tabs.Screen name="settings"  options={{ title: 'Settings' }} />


      {/* hide from tab bar */}
      <Tabs.Screen name="workouts/[id]/start" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="workouts/[id]/complete" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="my-workouts" options={{ href: null }} />
      <Tabs.Screen name="select-position" options={{ href: null }} />
      <Tabs.Screen name="exercises/[position]" options={{ href: null }} />
      <Tabs.Screen name="workouts/[id]" options={{ href: null }} />


    </Tabs>
  );
}