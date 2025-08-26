// theme.ts – responsive sizing + global styles
// Single source of truth for responsive helpers & shared styles.
// Colors come from constants/Colors so you only maintain one palette.

import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

/* -------------------------------------------------------------------------- */
/* Responsive helpers                                                         */
/* -------------------------------------------------------------------------- */
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/* -------------------------------------------------------------------------- */
/* Design tokens                                                              */
/* -------------------------------------------------------------------------- */
export const SIZES = {
  // Spacing
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),

  // Typography
  h1: moderateScale(32),
  h2: moderateScale(24),
  h3: moderateScale(20),
  body: moderateScale(14),
  caption: moderateScale(12),

  // Misc
  radius: scale(12),
} as const;

/* -------------------------------------------------------------------------- */
/* Global style sheet                                                         */
/* -------------------------------------------------------------------------- */
export const GlobalStyles = StyleSheet.create({
  /* Layout helpers */
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.lg,
    paddingTop: verticalScale(20),
  },

  /* Typography */
  header: {
    fontSize: SIZES.h1,
    fontWeight: '700',
    color: COLORS.text,
    paddingTop: verticalScale(45),
    marginBottom: verticalScale(16),
    marginLeft: verticalScale(60),   
    marginRight: verticalScale(60),
    textAlign: 'center',
  },
    header1: {
    fontSize: SIZES.h1,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: verticalScale(1),
  paddingLeft: moderateScale(70), 
    marginRight: verticalScale(5),
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

  /* Header row / nav bar */
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',   
  position: 'relative',     
  marginBottom: verticalScale(18),
},
  backText: {
    fontSize: moderateScale(16),
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
    flex: 1, 
  },
  title_auth: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: verticalScale(32), 
  },
 add_back_Button: {
  backgroundColor: COLORS.primary,
  width: moderateScale(56),
  height: moderateScale(56),
  borderRadius: moderateScale(56),
  position: 'absolute',
  left: scale(3), 
  top: scale(40),
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
 add_back_exercises_Button: {
  backgroundColor: COLORS.primary,
  width: moderateScale(56),
  height: moderateScale(56),
  borderRadius: moderateScale(56),
  position: 'absolute',
  left: scale(20), 
  zIndex: 10,
  top: scale(15),
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
 add_plus_Button: {
  backgroundColor: COLORS.primary,
  width: moderateScale(56),
  height: moderateScale(56),
  borderRadius: moderateScale(56),
  position: 'absolute',
  right: scale(3), 
  top: scale(40),
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
add_backText: {
  color: '#fff',
  fontSize: 32,
  fontWeight: '300', 
  lineHeight: 36, 
  includeFontPadding: false,
  textAlignVertical: 'center',
},

  /* Banners / alerts */
  banner: {
    backgroundColor: COLORS.warning,
    padding: SIZES.sm,
    borderRadius: SIZES.xs + SIZES.xs, 
    marginBottom: SIZES.sm,
    alignItems: 'center',
  },
  bannerText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: SIZES.caption,
  },

  /* Generic rows */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },

  /* Headings inside list sections (alias) */
  section: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
  },

  /* Links / CTA text */
  addLink: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: SIZES.body,
  },
  addDisabled: {
    opacity: 0.5,
  },

  /* Buttons (generic + start) for                           */
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

  /* Start buttons with states */
  startBtn: {
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  startEnabled: { backgroundColor: COLORS.primary },
  startDisabled: { backgroundColor: COLORS.surface, opacity: 0.6 },
  startActive: { backgroundColor: COLORS.warning },
  startText: {
    fontWeight: '600',
    fontSize: moderateScale(16),
    color: COLORS.background,
  },

  /* Cards & list items */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flex: 1 },
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

  /* Tags */
  tagCircle: {
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
  },
  tagText: {
    color: '#000',
    fontWeight: '600',
    fontSize: moderateScale(12),
  },

  /* Delete swipe box */
  deleteBox: {
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(90),
    borderRadius: SIZES.radius,
  },
  deleteText: {
    color: COLORS.text,
    fontWeight: '700',
  },

  /* Empty states */
  empty: { alignItems: 'center', marginTop: verticalScale(40) },
  noText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
  },
  subText: {
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  /* Call‑to‑action button */
  cta: {
    backgroundColor: COLORS.primary,
    padding: SIZES.sm + SIZES.xs, // 12
    borderRadius: SIZES.radius - scale(2),
    marginTop: SIZES.sm + SIZES.xs,
    alignItems: 'center',
  },
  ctaText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: SIZES.body,
  },

  /* Modal */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.md + SIZES.sm,
    width: '85%',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(12),
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.xs + SIZES.xs,
    padding: SIZES.sm + SIZES.xs,
    color: COLORS.text,
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.md + SIZES.xs,
  },
  cancelBtn: {
    flex: 1,
    marginRight: SIZES.xs,
    backgroundColor: COLORS.surface,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderRadius: SIZES.radius - scale(2),
  },
  addBtn: {
    flex: 1,
    marginLeft: SIZES.xs,
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderRadius: SIZES.radius - scale(2),
  },
  cancelText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  addTextBtn: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },

  /* Stats row ------------------------------------------------------------- */
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
  email: {
    fontSize: 16,
    color: '#ebebeb',
    marginBottom: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
});

/* -------------------------------------------------------------------------- */
/* Export consolidated theme object                                           */
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
