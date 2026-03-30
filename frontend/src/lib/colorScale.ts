export function getIntensityColor(value: number): string {
  if (value >= 0.85) return '#ef4444'; // Red-500
  if (value >= 0.7) return '#f97316';  // Orange-500
  if (value >= 0.55) return '#f59e0b'; // Amber-500
  if (value >= 0.4) return '#eab308';  // Yellow-500
  if (value >= 0.25) return '#84cc16'; // Lime-500
  return '#22c55e';                    // Green-500
}
