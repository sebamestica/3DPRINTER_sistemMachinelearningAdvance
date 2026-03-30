export type MetricContext = 'low' | 'medium' | 'high';
export type MetricSentiment = 'favorable' | 'unfavorable' | 'neutral';

export interface Interpretation {
  context: MetricContext;
  sentiment: MetricSentiment;
  label: string;
  description: string;
}

export const interpretMetric = (
  name: string,
  value: number,
  objective: 'resistance' | 'absorption' | 'balance'
): Interpretation => {
  // Simple logic for now, can be expanded based on technical thresholds
  switch (name) {
    case 'compressiveStrength':
      if (value < 20) return { context: 'low', sentiment: objective === 'resistance' ? 'unfavorable' : 'neutral', label: 'Baja Resistencia', description: 'Capacidad de carga limitada para aplicaciones estructurales.' };
      if (value < 45) return { context: 'medium', sentiment: 'neutral', label: 'Resistencia Media', description: 'Comportamiento balanceado para usos generales.' };
      return { context: 'high', sentiment: objective === 'resistance' ? 'favorable' : 'neutral', label: 'Alta Resistencia', description: 'Excelente capacidad de soporte bajo compresión.' };
    
    case 'relativeDeformation':
      if (value < 0.1) return { context: 'low', sentiment: objective === 'absorption' ? 'unfavorable' : 'favorable', label: 'Deformación Mínima', description: 'Alta rigidez estructural.' };
      if (value < 0.25) return { context: 'medium', sentiment: 'neutral', label: 'Deformación Controlada', description: 'Cierto grado de flexibilidad bajo carga.' };
      return { context: 'high', sentiment: objective === 'absorption' ? 'favorable' : 'unfavorable', label: 'Alta Deformación', description: 'Gran capacidad de absorción de energía/impacto.' };
    
    case 'efficiency':
      if (value < 0.5) return { context: 'low', sentiment: 'unfavorable', label: 'Baja Eficiencia', description: 'Alto uso de material para el rendimiento obtenido.' };
      return { context: 'high', sentiment: 'favorable', label: 'Alta Eficiencia', description: 'Optimización superior entre masa y resistencia.' };

    default:
      return { context: 'medium', sentiment: 'neutral', label: 'Normal', description: 'Valor dentro de rangos estándar.' };
  }
};

export const METRIC_DEFINITIONS = {
  compressiveStrength: {
    label: 'Resistencia a la Compresión',
    meaning: 'Capacidad máxima de carga por unidad de área antes de fallo catastrófico.',
    relevance: 'Crítico para estabilidad estructural.'
  },
  relativeDeformation: {
    label: 'Deformación Relativa',
    meaning: 'Porcentaje de cambio dimensional bajo carga máxima aplicada.',
    relevance: 'Predice la fragilidad del componente.'
  },
  massEfficiency: {
    label: 'Eficiencia de Masa',
    meaning: 'Relación entre la resistencia obtenida y la densidad de material utilizada.',
    relevance: 'Indica uso óptimo de recursos en fabricación.'
  }
};

