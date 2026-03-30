/**
 * TEST LAB DOMAIN TYPES
 * Experimental Design and Sample Management
 */

import type { MaterialType, ArchitectureType, OrientationType } from '../product/types';

export interface ExperimentVariant {
  id: string;
  label: string;
  material: MaterialType;
  architecture: ArchitectureType;
  infill: number;
  strutThickness: number;
  orientation: OrientationType;
  sampleCount: number;
  status: 'pending' | 'simulated' | 'failed' | 'complete';
}

export interface TestMatrix {
  id: string;
  name: string;
  materials: MaterialType[];
  architectures: ArchitectureType[];
  infills: number[];
  strutThicknesses: number[];
  orientations: OrientationType[];
  samplesPerVariant: number;
  createdAt: number;
}

export interface LabSession {
  activeExperimentId: string | null;
  matrix: TestMatrix;
  variants: ExperimentVariant[];
}
