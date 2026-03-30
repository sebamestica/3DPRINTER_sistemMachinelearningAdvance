import * as THREE from 'three';
import { useMemo } from 'react';
import type { InputParameters } from '../../types/model';

interface Props {
  parameters: InputParameters;
  size: number;
}

export function OuterShell({ parameters, size }: Props) {
  // Logic to calculate opacity and visibility based on VisualMode
  const opacity = useMemo(() => {
    switch (parameters.visualMode) {
      case 'solid': return 0.92;
      case 'transparent': return 0.28;
      case 'internal-only': return 0;
      case 'section': return 0.35;
      case 'exploded': return 0.45;
      default: return 0.85;
    }
  }, [parameters.visualMode]);

  const visible = parameters.visualMode !== 'internal-only';
  if (!visible) return null;

  // Deformation factor (conceptual)
  // Compress on Y axis based on parameters.compressionLevel
  const deformationY = (parameters.compressionLevel / 100) * 0.08; 
  const scaleY = 1 - deformationY;

  return (
    <group scale={[1.002, scaleY, 1.002]}>
      {/* 1. Main Transparent Box */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color={parameters.material === 'TPU' ? '#a78bfa' : '#f8fafc'}
          transparent
          opacity={opacity}
          roughness={0.12}
          metalness={0.05}
          transmission={parameters.visualMode === 'transparent' ? 0.8 : 0}
          thickness={parameters.shellThickness * 2}
          ior={1.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Structured Edges (Visible Wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial 
          color="#cbd5e1" 
          transparent 
          opacity={parameters.visualMode === 'internal-only' ? 0 : 0.6} 
        />
      </lineSegments>

      {/* 3. Surface Polish Layer (Subtle Gradient effect) */}
      <mesh scale={[1.005, 1.005, 1.005]}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#334155"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
