/**
 * PRODUCT DOMAIN TYPES
 * Core design parameters and configuration
 */

export type ArchitectureType = 'gyroid' | 'diamond' | 'octet' | 'honeycomb' | 'schwarz' | 'custom';
export type MaterialType = 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'Nylon' | 'Carbon_PLA';
export type ViewMode = 'solid' | 'wireframe' | 'transparent' | 'xray';
export type OrientationType = 'xyz' | 'xzy' | 'yxz' | 'zxy' | 'zyx' | 'yzx';

export interface Dimensions {
  x: number; // mm
  y: number;
  z: number;
}

export interface ProductState {
  // Core dimensions
  dimensions: Dimensions;
  
  // Material configuration
  material: MaterialType;
  
  // Architecture configuration
  architecture: ArchitectureType;
  cellSize: number;           // mm - tamaño de celda unitaria
  strutThickness: number;     // mm - grosor de pilares
  infillDensity: number;      // % - densidad de relleno (0-100)
  
  // Manufacturing parameters
  layerHeight: number;        // mm
  nozzleSize: number;        // mm
  printSpeed: number;        // mm/s
  printTemp: number;         // °C
  bedTemp: number;           // °C
  
  // Orientation
  orientation: OrientationType;
  
  // Visualization
  viewMode: ViewMode;
  
  // Variant tracking
  activeVariantId: string | null;
  variantHistory: string[];
  
  // Metadata
  lastModified: number;
  version: string;
}

export interface ProductActions {
  // Dimension updates
  setDimensions: (dims: Partial<Dimensions>) => void;
  
  // Material updates
  setMaterial: (material: MaterialType) => void;
  
  // Architecture updates
  setArchitecture: (arch: ArchitectureType) => void;
  setCellSize: (size: number) => void;
  setStrutThickness: (thickness: number) => void;
  setInfillDensity: (density: number) => void;
  
  // Manufacturing updates
  setLayerHeight: (height: number) => void;
  setNozzleSize: (size: number) => void;
  setPrintSpeed: (speed: number) => void;
  setPrintTemp: (temp: number) => void;
  setBedTemp: (temp: number) => void;
  
  // Orientation
  setOrientation: (orientation: OrientationType) => void;
  
  // Visualization
  setViewMode: (mode: ViewMode) => void;
  
  // Variants
  setActiveVariant: (id: string | null) => void;
  saveVariant: (id: string) => void;
  
  // Bulk updates
  updateParameters: (params: Partial<ProductState>) => void;
  resetToDefaults: () => void;
}

export const DEFAULT_PRODUCT: ProductState = {
  dimensions: { x: 50, y: 50, z: 50 },
  material: 'PLA',
  architecture: 'gyroid',
  cellSize: 5,
  strutThickness: 0.8,
  infillDensity: 40,
  layerHeight: 0.2,
  nozzleSize: 0.4,
  printSpeed: 60,
  printTemp: 210,
  bedTemp: 60,
  orientation: 'xyz',
  viewMode: 'solid',
  activeVariantId: null,
  variantHistory: [],
  lastModified: Date.now(),
  version: '1.0.0'
};