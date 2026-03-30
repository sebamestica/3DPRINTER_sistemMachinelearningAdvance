/**
 * PRODUCT STORE
 * Central state for design parameters
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ProductState, ProductActions, Dimensions, MaterialType, ArchitectureType, ViewMode, OrientationType } from '../../domain/product/types';
import { DEFAULT_PRODUCT } from '../../domain/product/types';

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...DEFAULT_PRODUCT,

        // Dimension updates
        setDimensions: (dims: Partial<Dimensions>) => set(
          (state) => ({
            dimensions: { ...state.dimensions, ...dims },
            lastModified: Date.now()
          }),
          false,
          'setDimensions'
        ),

        // Material updates
        setMaterial: (material: MaterialType) => set(
          (state) => ({ material, lastModified: Date.now() }),
          false,
          'setMaterial'
        ),

        // Architecture updates
        setArchitecture: (architecture: ArchitectureType) => set(
          (state) => ({ architecture, lastModified: Date.now() }),
          false,
          'setArchitecture'
        ),

        setCellSize: (cellSize: number) => set(
          (state) => ({ cellSize, lastModified: Date.now() }),
          false,
          'setCellSize'
        ),

        setStrutThickness: (strutThickness: number) => set(
          (state) => ({ strutThickness, lastModified: Date.now() }),
          false,
          'setStrutThickness'
        ),

        setInfillDensity: (infillDensity: number) => set(
          (state) => ({ infillDensity, lastModified: Date.now() }),
          false,
          'setInfillDensity'
        ),

        // Manufacturing updates
        setLayerHeight: (layerHeight: number) => set(
          (state) => ({ layerHeight, lastModified: Date.now() }),
          false,
          'setLayerHeight'
        ),

        setNozzleSize: (nozzleSize: number) => set(
          (state) => ({ nozzleSize, lastModified: Date.now() }),
          false,
          'setNozzleSize'
        ),

        setPrintSpeed: (printSpeed: number) => set(
          (state) => ({ printSpeed, lastModified: Date.now() }),
          false,
          'setPrintSpeed'
        ),

        setPrintTemp: (printTemp: number) => set(
          (state) => ({ printTemp, lastModified: Date.now() }),
          false,
          'setPrintTemp'
        ),

        setBedTemp: (bedTemp: number) => set(
          (state) => ({ bedTemp, lastModified: Date.now() }),
          false,
          'setBedTemp'
        ),

        // Orientation
        setOrientation: (orientation: OrientationType) => set(
          (state) => ({ orientation, lastModified: Date.now() }),
          false,
          'setOrientation'
        ),

        // Visualization
        setViewMode: (viewMode: ViewMode) => set(
          (state) => ({ viewMode, lastModified: Date.now() }),
          false,
          'setViewMode'
        ),

        // Variants
        setActiveVariant: (activeVariantId: string | null) => set(
          (state) => ({ activeVariantId, lastModified: Date.now() }),
          false,
          'setActiveVariant'
        ),

        saveVariant: (id: string) => set(
          (state) => ({
            variantHistory: [...state.variantHistory, id],
            activeVariantId: id,
            lastModified: Date.now()
          }),
          false,
          'saveVariant'
        ),

        // Bulk updates
        updateParameters: (params: Partial<ProductState>) => set(
          (state) => ({
            ...state,
            ...params,
            lastModified: Date.now()
          }),
          false,
          'updateParameters'
        ),

        resetToDefaults: () => set(
          { ...DEFAULT_PRODUCT, lastModified: Date.now() },
          false,
          'resetToDefaults'
        )
      }),
      {
        name: 'pla-product-store',
        partialize: (state) => ({
          dimensions: state.dimensions,
          material: state.material,
          architecture: state.architecture,
          cellSize: state.cellSize,
          strutThickness: state.strutThickness,
          infillDensity: state.infillDensity,
          layerHeight: state.layerHeight,
          nozzleSize: state.nozzleSize,
          orientation: state.orientation,
          variantHistory: state.variantHistory
        })
      }
    ),
    { name: 'ProductStore' }
  )
);

// Selectors for performance
export const selectDimensions = (state: ProductState) => state.dimensions;
export const selectMaterial = (state: ProductState) => state.material;
export const selectArchitecture = (state: ProductState) => state.architecture;
export const selectGeometryParams = (state: ProductState) => ({
  cellSize: state.cellSize,
  strutThickness: state.strutThickness,
  infillDensity: state.infillDensity
});
export const selectManufacturingParams = (state: ProductState) => ({
  layerHeight: state.layerHeight,
  nozzleSize: state.nozzleSize,
  printSpeed: state.printSpeed,
  printTemp: state.printTemp,
  bedTemp: state.bedTemp
});