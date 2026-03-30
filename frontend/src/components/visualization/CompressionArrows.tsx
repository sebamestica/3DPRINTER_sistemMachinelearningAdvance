import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface Props {
  level: number;
  size: number;
}

export function CompressionArrows({ level, size }: Props) {
  const arrowsRef = useRef<THREE.Group>(null);
  const arrowCount = 4;
  const arrowSpacing = size * 0.45;
  const arrowScale = 0.5 + (level / 150);

  // Simple animation for the force arrows
  useFrame((state) => {
    if (arrowsRef.current) {
      arrowsRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * (level / 500);
    }
  });

  return (
    <group ref={arrowsRef} position={[0, size / 2 + 2.5, 0]}>
      {/* Visual representation of Force Vector arrows */}
      {[...Array(arrowCount)].map((_, i) => (
        <group 
          key={i} 
          position={[
            (i & 1 ? 1 : -1) * arrowSpacing,
            0,
            (i & 2 ? 1 : -1) * arrowSpacing
          ]}
          rotation={[Math.PI, 0, 0]}
          scale={[arrowScale, arrowScale, arrowScale]}
        >
          {/* Arrow Cylinder */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
            <meshStandardMaterial 
              color={level > 60 ? "#ef4444" : level > 30 ? "#f97316" : "#3b82f6"} 
              emissive={level > 60 ? "#991b1b" : "#1e40af"}
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Arrow Cone */}
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.3, 0.6, 12]} />
            <meshStandardMaterial 
              color={level > 60 ? "#ef4444" : level > 30 ? "#f97316" : "#3b82f6"} 
              emissive={level > 60 ? "#991b1b" : "#1e40af"}
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      ))}

      {/* Force Label */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
