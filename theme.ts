// theme.ts – responsive sizing + global styles
// Uses existing palette in constants/Colors.  Import *once* and share everywhere.

import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

/* -------------------------------------------------------------------------- */
/* Responsive helpers                                                         */
/* -------------------------------------------------------------------------- */
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;   // change if your Figma frame differs
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/* -------------------------------------------------------------------------- */
/* Design tokens                                                              */
/* -------------------------------------------------------------------------- */
export const SIZES = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),

  h1: moderateScale(32),
  h2: moderateScale(24),
  h3: moderateScale(20),
  body: moderateScale(14),
  caption: moderateScale(12),

  radius: scale(12),
} as const;

/* -------------------------------------------------------------------------- */
/* Global style sheet                                                         */
/* -------------------------------------------------------------------------- */
export const GlobalStyles = StyleSheet.create({
  /* Layout */
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.lg,
    paddingTop: verticalScale(70),
  },

  /* Typography */
  header: {
    fontSize: SIZES.h1,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: verticalScale(8),
  },
  paragraph: {
    fontSize: SIZES.body,
    color: COLORS.text,
    lineHeight: verticalScale(20),
  },

  /* Buttons */
  startButton: {
    backgroundColor: '#14532d',
    borderRadius: SIZES.radius,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: moderateScale(18),
    fontWeight: '600',
  },

  /* Cards */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: SIZES.body,
    marginTop: verticalScale(4),
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
    marginTop: SIZES.sm,
  },
  statBlock: { flex: 1 },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.caption,
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  statValue: {
    color: COLORS.text,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

/* -------------------------------------------------------------------------- */
/* Theme object + exports                                                     */
/* -------------------------------------------------------------------------- */
const Theme = {
  COLORS,
  SIZES,
  scale,
  verticalScale,
  moderateScale,
  GlobalStyles,
};

export default Theme;
