import type { GeometryCardData } from '../types/geometry';

export const GEOMETRIES: GeometryCardData[] = [
  {
    type: 'solid',
    name: 'Sólido (100% Infill)',
    description: 'Máxima densidad y masa. Estructura compacta sin cavidades internas.',
    strengths: ['Máxima resistencia bruta', 'Simplicidad de fabricación', 'Alta rigidez'],
    tradeOffs: ['Uso ineficiente de material', 'Baja absorción de energía (frágil)', 'Pesado'],
    profile: { isotropy: 0.9, energyAbsorption: 0.2, verticalStrengthRatio: 1.5, printability: 0.95 }
  },
  {
    type: 'gyroid',
    name: 'Gyroid',
    description: 'Estructura minimal triplemente periódica. Proporciona resistencia isotrópica superior.',
    strengths: ['Resistencia similar en todas direcciones', 'Excelente para disipación de calor', 'Buen balance masa/resistencia'],
    tradeOffs: ['Complejidad de renderizado', 'Puede ser difícil de imprimir con ciertos materiales'],
    profile: { isotropy: 0.95, energyAbsorption: 0.8, verticalStrengthRatio: 1.1, printability: 0.8 }
  },
  {
    type: 'honeycomb',
    name: 'Honeycomb (Panal)',
    description: 'Patrón hexagonal inspirado en la naturaleza. Alta eficiencia estructural.',
    strengths: ['Excelente relación peso/resistencia', 'Muy estable en dirección vertical', 'Menos tiempo de impresión'],
    tradeOffs: ['Anisotropía (débil lateralmente)', 'Puntos de falla en esquinas'],
    profile: { isotropy: 0.4, energyAbsorption: 0.5, verticalStrengthRatio: 1.4, printability: 0.9 }
  },
  {
    type: 'rectilinear',
    name: 'Rectilíneo',
    description: 'Capas cruzadas a 90°. La opción más común en FDM.',
    strengths: ['Fabricación rápida', 'Buena predecibilidad', 'Fácil de imprimir'],
    tradeOffs: ['Fácil deslaminación bajo ciertas cargas', 'Distribución de carga irregular'],
    profile: { isotropy: 0.5, energyAbsorption: 0.4, verticalStrengthRatio: 1.0, printability: 1.0 }
  },
  {
    type: 'cubic',
    name: 'Cúbico',
    description: 'Patrón de cajas tridimensionales que se repiten.',
    strengths: ['Buena resistencia a compresión', 'Rápido de imprimir', 'Estable'],
    tradeOffs: ['Zonas muertas sin soporte', 'Concentración de esfuerzos en nodos'],
    profile: { isotropy: 0.7, energyAbsorption: 0.6, verticalStrengthRatio: 1.2, printability: 0.9 }
  },
  {
    type: 'diamond',
    name: 'Diamante',
    description: 'Estructura basada en pirámides que se tocan por sus puntas.',
    strengths: ['Excelente absorción de impactos', 'Estructura ligera', 'Muy estético'],
    tradeOffs: ['Difícil de imprimir con soportes', 'Frágil en densidades bajas'],
    profile: { isotropy: 0.8, energyAbsorption: 0.9, verticalStrengthRatio: 0.9, printability: 0.6 }
  },
  {
    type: 'lattice',
    name: 'Lattice (Celosía)',
    description: 'Red de vigas delgadas interconectadas.',
    strengths: ['Peso mínimo', 'Permite flujo de fluidos/aire', 'Modular'],
    tradeOffs: ['Requiere alta precisión', 'Puede fallar por pandeo de vigas individuales'],
    profile: { isotropy: 0.6, energyAbsorption: 0.7, verticalStrengthRatio: 0.8, printability: 0.7 }
  },
  {
    type: 'octet',
    name: 'Octet Truss',
    description: 'Combinación de octaedros y tetraedros.',
    strengths: ['Máxima eficiencia estructural teórica', 'Rigidez excepcional', 'Distribución de carga óptima'],
    tradeOffs: ['Muy complejo de fabricar', 'Solo viable para metales o resinas'],
    profile: { isotropy: 0.9, energyAbsorption: 0.75, verticalStrengthRatio: 1.3, printability: 0.5 }
  }
];
