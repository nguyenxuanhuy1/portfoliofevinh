/** Shared color tokens for learnEnglish TS/TSX (mirror of variables.scss) */
export const LE_COLORS = {
  ink: '#0d0d0d',
  white: '#ffffff',
  black: '#000000',

  yellow: '#ffdb33',
  yellowSoft: '#ffe169',
  coral: '#ff6b6b',
  orange: '#ff9f43',
  mint: '#4ecdc4',
  purple: '#7b2fff',
  green: '#3ddc97',
  pink: '#f472b6',
  blue: '#5887ff',
  wrong: '#ff3b5c',
  danger: '#e63946',
  success: '#16a34a',
  warning: '#f59e0b',

  cream: '#f5f5f0',
  gray50: '#f9fafb',
  gray100: '#f5f5f5',
  gray150: '#f0f0f0',
  gray200: '#e8e8e8',
  gray250: '#e5e7eb',
  gray300: '#e0e0e0',
  gray350: '#d8d8d8',
  gray400: '#bfbfbf',
  gray500: '#999999',
  gray550: '#888888',
  gray600: '#777777',
  gray650: '#aeaeae',
  gray700: '#555555',
  gray800: '#444444',
  gray850: '#333333',
  gray900: '#222222',

  font: "'Be Vietnam Pro', sans-serif",
  fontDisplay: "'Be Vietnam Pro', sans-serif",
  fontCartoon: "'Archivo Black', 'Arial Black', sans-serif",
} as const

/** Rotating card backgrounds — LessonCard / History */
export const LE_CARD_COLORS = [
  '#ff6d6d',
  '#5887ff',
  '#4ade80',
  '#facc15',
  '#fb923c',
  '#f472b6',
  '#c084fc',
  '#2dd4bf',
] as const

/** Results breakdown row colors */
export const LE_RESULT_ROW_COLORS = [
  LE_COLORS.yellow,
  LE_COLORS.mint,
  LE_COLORS.orange,
  LE_COLORS.pink,
  LE_COLORS.blue,
  LE_COLORS.green,
] as const

export type LeColorKey = keyof typeof LE_COLORS
