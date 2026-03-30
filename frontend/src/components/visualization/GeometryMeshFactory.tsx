import { useMemo } from 'react';
import type { GeometryType } from '../../types/geometry';

interface Props {
  type: GeometryType;
  size: number;
  infill: number;
  padding: number;
  compression: number;
}

export function GeometryMeshFactory({ type, size, infill, padding, compression }: Props) {
  const innerSize = size - padding * 2;
  const deformationY = (compression / 100) * 0.1;
  const scaleY = 1 - deformationY;
  
  // Density of the grid/points
  const density = useMemo(() => Math.floor(infill / 10) + 3, [infill]);

  return useMemo(() => {
    switch (type) {
      case 'solid':
        return (
          <mesh scale={[1, scaleY, 1]}>
            <boxGeometry args={[innerSize, innerSize, innerSize]} />
            <meshStandardMaterial 
              color="#475569" 
              roughness={0.65} 
              metalness={0.12}
              transparent
              opacity={0.92}
            />
          </mesh>
        );

      case 'honeycomb':
        return (
          <group scale={[1, scaleY, 1]}>
            {Array.from({ length: density }).map((_, i) => (
              <group key={i} position={[0, 0, (i - density / 2) * (innerSize / density)]}>
                {Array.from({ length: density }).map((_, j) => (
                  <mesh key={j} position={[(j - density / 2) * (innerSize / density), 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[innerSize / (density * 2), innerSize / (density * 2), innerSize, 6]} />
                    <meshStandardMaterial color="#64748b" roughness={0.4} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );

      case 'rectilinear':
        return (
          <group scale={[1, scaleY, 1]}>
            {Array.from({ length: density * 2 }).map((_, i) => (
              <mesh key={i} position={[0, (i - density) * (innerSize / (density * 2)), 0]}>
                <boxGeometry args={[innerSize, 0.05, innerSize]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            ))}
            {Array.from({ length: density * 2 }).map((_, i) => (
              <mesh key={i + 100} position={[(i - density) * (innerSize / (density * 2)), 0, 0]}>
                <boxGeometry args={[0.05, innerSize, innerSize]} />
                <meshStandardMaterial color="#64748b" transparent opacity={0.5} />
              </mesh>
            ))}
          </group>
        );

      case 'gyroid':
      case 'diamond':
        return (
          <group scale={[1, scaleY, 1]}>
             <mesh>
               <boxGeometry args={[innerSize, innerSize, innerSize]} />
               <meshStandardMaterial color="#334155" wireframe transparent opacity={0.6} />
             </mesh>
             {/* Conceptual wavy representation using torus / distorted elements */}
             {Array.from({ length: density }).map((_, i) => (
               <mesh key={i} position={[(Math.random() - 0.5) * innerSize, (Math.random() - 0.5) * innerSize, (Math.random() - 0.5) * innerSize]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                  <torusGeometry args={[innerSize / 8, 0.05, 8, 16]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} />
               </mesh>
             ))}
          </group>
        );

      case 'octet':
      case 'lattice':
        return (
          <group scale={[1, scaleY, 1]}>
            {/* Struts and nodes representation */}
            {Array.from({ length: density * 4 }).map((_, i) => (
               <mesh key={i} position={[
                 (Math.random() - 0.5) * innerSize,
                 (Math.random() - 0.5) * innerSize,
                 (Math.random() - 0.5) * innerSize
               ]}>
                 <sphereGeometry args={[innerSize / 30, 8, 8]} />
                 <meshStandardMaterial color="#cbd5e1" />
               </mesh>
            ))}
            <mesh>
              <boxGeometry args={[innerSize, innerSize, innerSize]} />
              <meshStandardMaterial wireframe color="#475569" />
            </mesh>
          </group>
        );

      case 'cubic':
        return (
          <group scale={[1, scaleY, 1]}>
            {Array.from({ length: density }).map((_, i) => (
              <group key={i} position={[0, (i - density / 2) * (innerSize / density), 0]}>
                <mesh>
                  <boxGeometry args={[innerSize, 0.02, innerSize]} />
                  <meshStandardMaterial color="#cbd5e1" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                   <boxGeometry args={[innerSize, 0.02, innerSize]} />
                   <meshStandardMaterial color="#64748b" />
                </mesh>
              </group>
            ))}
          </group>
        );

      default:
        return (
          <mesh scale={[1, scaleY, 1]}>
            <boxGeometry args={[innerSize, innerSize, innerSize]} />
            <meshStandardMaterial wireframe color="#ff0000" />
          </mesh>
        );
    }
  }, [type, innerSize, infill, density, scaleY]);
}
