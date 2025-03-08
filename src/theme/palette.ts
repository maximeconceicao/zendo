// src/theme/palette.ts

export const PALETTE = {
  primary: {
    light: '#6D28D9',
    main: '#5B21B6',
    dark: '#4C1D95'
  },
  secondary: {
    light: '#FDE047',
    main: '#FACC15',
    dark: '#EAB308'
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    grayLight: '#F3F4F6',
    gray: '#9CA3AF',
    grayDark: '#4B5563'
  },
  background: {
    light: '#E5E4E2',
    //light: '#F0E5DE',
    dark: '#1F2937'
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF'
  }
} as const;

export type PaletteType = typeof PALETTE;
