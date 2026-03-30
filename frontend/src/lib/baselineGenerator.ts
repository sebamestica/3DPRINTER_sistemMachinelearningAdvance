export type ObjectiveType = 'resistance' | 'absorption' | 'balance';

export interface BaselineConfig {
  geometry: 'gyroid' | 'honeycomb' | 'octet' | 'solid';
  material: 'PLA' | 'ABS' | 'PETG' | 'TPU';
  infill: number;
  shell: number;
  padding: number;
  cellSize: number;
  strutThickness: number;
}

export const getBaselineForObjective = (objective: ObjectiveType): BaselineConfig => {
  switch (objective) {
    case 'resistance':
      return {
        geometry: 'honeycomb',
        material: 'PLA',
        infill: 45,
        shell: 0.3,
        padding: 0.2,
        cellSize: 1.0,
        strutThickness: 0.15
      };
    case 'absorption':
      return {
        geometry: 'gyroid',
        material: 'TPU', // Assuming TPU is available for absorption
        infill: 25,
        shell: 0.1,
        padding: 0.05,
        cellSize: 2.0,
        strutThickness: 0.08
      };
    case 'balance':
    default:
      return {
        geometry: 'gyroid',
        material: 'PLA',
        infill: 35,
        shell: 0.2,
        padding: 0.15,
        cellSize: 1.5,
        strutThickness: 0.1
      };
  }
};
