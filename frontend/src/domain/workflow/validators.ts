/**
 * WORKFLOW VALIDATORS
 * Formal and reusable guards for the design-to-deployment flow
 */

import type { ProductState } from '../product/types';
import type { SimulationState } from '../simulation/types';
import type { StageValidation } from './types';

export const validateSetup = (product: ProductState): StageValidation => {
  const blockers: string[] = [];
  
  if (!product.dimensions.x || !product.dimensions.y || !product.dimensions.z) {
    blockers.push('Dimensiones (X, Y, Z) son requeridas');
  }
  if (!product.material) {
    blockers.push('Selección de material obligatoria');
  }
  if (!product.architecture) {
    blockers.push('Tipo de arquitectura requerida');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings: []
  };
};

export const validateDesign = (product: ProductState): StageValidation => {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (product.cellSize < 0.5) {
    blockers.push('Escala de celda insuficiente (min 0.5)');
  }
  if (product.strutThickness < 0.05) {
    blockers.push('Grosor de strut menor al límite físico (0.05cm)');
  }
  if (product.infillDensity < 10) {
    blockers.push('Densidad de relleno insuficiente para integridad (min 10%)');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings
  };
};

export const validateSlicing = (product: ProductState): StageValidation => {
  const blockers: string[] = [];
  
  if (product.layerHeight <= 0 || product.layerHeight > 1) {
    blockers.push('Altura de capa fuera de rango (0.01 - 1.0mm)');
  }
  if (product.nozzleSize < 0.2 || product.nozzleSize > 1.2) {
    blockers.push('Diámetro de boquilla no estándar');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings: []
  };
};

export const validateSimulate = (simulation: SimulationState): StageValidation => {
  const blockers: string[] = [];
  
  if (simulation.status !== 'complete' || !simulation.prediction) {
    blockers.push('Ejecutar análisis de simulación mecánica');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings: simulation.warnings.map(w => w.message)
  };
};

export const validateCompare = (product: ProductState): StageValidation => {
  const blockers: string[] = [];
  
  if (product.variantHistory.length < 1) {
    blockers.push('Generar al menos una variante para comparación');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings: []
  };
};

export const validateDeploy = (product: ProductState): StageValidation => {
  const blockers: string[] = [];
  
  if (!product.activeVariantId) {
    blockers.push('Seleccionar variante final para exportación');
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings: []
  };
};
