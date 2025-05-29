// index.js  (project root)
import 'react-native-gesture-handler';  // ← must be at top
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

registerRootComponent(ExpoRoot);
