// Validated palette — see dataviz skill, references/palette.md.
// Categorical order is fixed (never cycled); sequential/status roles are separate slots.

export const seriesColors = [
  "#2a78d6", // 1 blue
  "#eb6834", // 2 orange
  "#1baf7a", // 3 aqua
  "#eda100", // 4 yellow
  "#e87ba4", // 5 magenta
  "#008300", // 6 green
  "#4a3aa7", // 7 violet
  "#e34948", // 8 red
];

// Sequential blue, steps 100→700 (near-surface → saturated), for magnitude/heatmap use.
export const sequentialBlue = [
  "#cde2fb", // 100
  "#9ec5f4", // 200
  "#6da7ec", // 300
  "#3987e5", // 400
  "#256abf", // 500
  "#184f95", // 600
  "#0d366b", // 700
];

export const statusColors = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
};

export const chartInk = {
  primary: "#18181b",
  secondary: "#52525b",
  muted: "#a1a1aa",
  grid: "#e5e7eb",
  axis: "#d1d5db",
  surface: "#ffffff",
};
