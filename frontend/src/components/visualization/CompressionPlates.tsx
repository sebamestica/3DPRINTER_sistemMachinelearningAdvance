import type { VisualMode } from '../../types/visualization';

interface Props {
  visualMode: VisualMode;
  size: number;
}

export function CompressionPlates({ visualMode, size }: Props) {
  const plateSize = size + 1.25;
  const plateHeight = 0.25;
  const plateOpacity = visualMode === 'internal-only' ? 0.3 : 0.85;

  return (
    <group>
      {/* 1. TOP PLATE (Active Pressure) */}
      <mesh position={[0, size / 2 + plateHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[plateSize, plateHeight, plateSize]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          metalness={0.65}
          roughness={0.15}
          transparent
          opacity={plateOpacity}
        />
      </mesh>

      {/* 2. BOTTOM PLATE (Static Support) */}
      <mesh position={[0, -size / 2 - plateHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[plateSize, plateHeight, plateSize]} />
        <meshPhysicalMaterial
          color="#94a3b8"
          metalness={0.4}
          roughness={0.25}
          transparent
          opacity={plateOpacity}
        />
      </mesh>

      {/* Plate Details / Borders */}
      <mesh position={[0, size / 2 + plateHeight / 2, 0]}>
        <boxGeometry args={[plateSize + 0.05, plateHeight + 0.05, plateSize + 0.05]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
