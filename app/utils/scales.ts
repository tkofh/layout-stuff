export const SIZE_SCALE = {
  "0": "0",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "40": "10rem",
  "48": "12rem",
  "56": "14rem",
  "64": "16rem",
  "80": "20rem",
  "96": "24rem",
  xs: "32rem",
  sm: "48rem",
  md: "64rem",
  lg: "80rem",
  xl: "96rem",
  full: "100%",
} as const;

export type Size = ResponsiveValue<keyof typeof SIZE_SCALE>;

export const SPACE_SCALE = {
  none: SIZE_SCALE["0"],
  xs: SIZE_SCALE["1"],
  sm: SIZE_SCALE["2"],
  md: SIZE_SCALE["3"],
  lg: SIZE_SCALE["4"],
  xl: SIZE_SCALE["6"],
  "2xl": SIZE_SCALE["8"],
} as const;

export type Space = ResponsiveValue<keyof typeof SPACE_SCALE>;
