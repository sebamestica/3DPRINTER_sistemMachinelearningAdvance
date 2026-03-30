import type { CubeParameters } from '../types/design';

/**
 * Manufacturing Rules for Additive Design Validation.
 * Evaluates printability, stability, and risk for 3D printed architectures.
 */

export interface ManufacturingAssessment {
  score: number; // 0-100
  risks: string[];
  merits: string[];
  verdict: 'printable' | 'caution' | 'high-risk';
}

export const evaluatePrintability = (params: CubeParameters): ManufacturingAssessment => {
  let score = 85; 
  const risks: string[] = [];
  const merits: string[] = [];

  // Rules based on manufacturing reality:
  
  // 1. Overhang Thresholds by Geometry
  if (params.geometry === 'gyroid') {
     merits.push("Auto-soportada: Curvatura continua minimiza voladizos.");
     score += 5;
  } else if (params.geometry === 'honeycomb') {
     risks.push("Puentes horizontales críticos en orientación vertical.");
     score -= 10;
  } else if (params.geometry === 'solid') {
     risks.push("Acumulación térmica severa: Riesgo de warping en la base.");
     score -= 15;
  }

  // 2. Density / Infill Integrity
  if (params.infill < 15) {
     risks.push("Fragilidad estructural: Baja densidad compromete la adhesión entre capas.");
     score -= 20;
  } else if (params.infill > 85) {
     risks.push("Sobreextrusión térmica: Dificulta el enfriamiento interno.");
     score -= 10;
  } else {
     merits.push("Densidad óptima para flujo de material y enfriamiento.");
     score += 5;
  }

  // 3. Shell vs Strut
  if (params.shellThickness < 0.8) {
     risks.push("Shell insuficiente: Riesgo de rotura perimetral bajo compresión.");
     score -= 10;
  }

  // Final Verdict
  const verdict = score > 80 ? 'printable' : score > 50 ? 'caution' : 'high-risk';

  return {
    score: Math.max(0, Math.min(100, score)),
    risks,
    merits,
    verdict
  };
};
