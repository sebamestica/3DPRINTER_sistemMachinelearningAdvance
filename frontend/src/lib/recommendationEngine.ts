import type { InputParameters, ModelResult } from '../types/model';
import type { RecommendationResult, DecisionWarning } from '../types/recommendation';
import { GEOMETRIES } from '../data/geometries';

export function buildInterpretation(
  params: InputParameters,
  result: ModelResult
): string {
  const geometryText: Record<string, string> = {
    solid: 'La variante sólida llena completamente el volumen del cubo, privilegiando masa y continuidad material.',
    gyroid: 'La geometría Gyroid ocupa el interior del cubo con una red continua e interconectada, favorable para una distribución conceptual más uniforme.',
    honeycomb: 'La arquitectura Honeycomb compartimenta el interior con celdas repetitivas, lo que puede resultar eficiente pero sensible a orientación.',
    rectilinear: 'La estructura rectilínea organiza el volumen interno en trayectorias ortogonales más simples.',
    cubic: 'La configuración cúbica divide el volumen interno en celdas regulares y fácilmente interpretables.',
    diamond: 'La geometría diamante introduce trayectorias diagonales que pueden mejorar la redistribución conceptual de carga.',
    lattice: 'La celosía genera una estructura abierta con múltiples rutas internas de soporte.',
    octet: 'La variante Octet Truss construye una red triangulada conceptualmente atractiva para explorar rigidez relativa.',
  };

  const modeText =
    params.analysisMode === 'strength'
      ? 'El análisis actual prioriza resistencia a compresión.'
      : params.analysisMode === 'absorption'
      ? 'El análisis actual prioriza absorción conceptual de energía.'
      : 'El análisis actual busca un balance entre resistencia y absorción.';

  return `${geometryText[params.geometry] || 'Arquitectura interna seleccionada para el cubo de 5x5x5 cm.'} ${modeText} Con los parámetros actuales, la resistencia estimada es ${result.compressiveStrength.toFixed(
    2
  )} MPa y la deformación relativa estimada es ${result.relativeDeformation.toFixed(
    2
  )} mm.`;
}

export const getRecommendation = (params: InputParameters, results: ModelResult): RecommendationResult => {
  const geo = GEOMETRIES.find(g => g.type === params.geometry) || GEOMETRIES[0];
  const warnings: DecisionWarning[] = [];
  const technicalReasons: string[] = [];
  const nextSteps: string[] = [
    'Comparar con una variante de mayor densidad (Gyroid o Honeycomb)',
    'Verificar la adhesión entre capas en una muestra pequeña',
    'Realizar una inspección detallada en el Laboratorio Avanzado'
  ];

  // Logic for Warnings
  if (params.infill < 20 && params.compressionLevel > 50) {
    warnings.push({
      severity: 'high',
      message: 'Densidad extremadamente baja para el nivel de compresión. Riesgo inminente de colapso del cubo.',
      parameterImpact: 'Se recomienda un infill superior al 40%.'
    });
  }

  if (params.material === 'TPU' && params.analysisMode === 'strength') {
    warnings.push({
      severity: 'medium',
      message: 'El TPU es un material elastomérico de baja rigidez estructural.',
      parameterImpact: 'Utilizar ABS o PETG para aplicaciones de carga vertical estática.'
    });
  }

  if (params.layerHeight > 0.3) {
    warnings.push({
      severity: 'low',
      message: 'Altura de capa elevada para una estructura interna compleja.',
      parameterImpact: 'Puede comprometer la integridad estructural de la red interna.'
    });
  }

  // Logic for Recommendation Level based on results
  let level: RecommendationResult['level'] = 'favorable';
  if (results.compressiveStrength < 5) level = 'risky';
  if (results.compressiveStrength < 2) level = 'not-recommended';
  if (results.compressiveStrength > 15 && results.confidence > 0.8) level = 'optimal';

  // Analysis Mode logic
  if (params.analysisMode === 'strength') {
    technicalReasons.push(`La arquitectura ${geo.name} dentro del cubo 5x5x5 proporciona una red de soporte vertical optimizada.`);
  } else if (params.analysisMode === 'absorption') {
    technicalReasons.push(`El patrón ${geo.name} permite una deformación progresiva y disipación de carga uniforme.`);
  }

  return {
    level,
    primaryRecommendation: level === 'risky' || level === 'not-recommended' 
      ? 'Se recomienda ajustar la geometría interna o aumentar el infill para asegurar la estabilidad.' 
      : 'Esta arquitectura es un candidato sólido para la fabricación y ensayo mecánico preliminar.',
    technicalReasons,
    warnings,
    nextSteps,
    prototypeRecommendation: level === 'optimal' || level === 'favorable'
  };
};
