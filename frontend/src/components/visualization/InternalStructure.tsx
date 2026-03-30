import { GeometryMeshFactory } from './GeometryMeshFactory';
import type { InputParameters } from '../../types/model';

interface Props {
  parameters: InputParameters;
  size: number;
}

export function InternalStructure({ parameters, size }: Props) {
  const padding = parameters.internalPadding || 0.2;
  const infill = parameters.infill || 35;
  const compression = parameters.compressionLevel || 25;

  return (
    <group>
      <GeometryMeshFactory 
        type={parameters.geometry}
        size={size}
        infill={infill}
        padding={padding}
        compression={compression}
      />
      
      {/* Visual Reinforcement Nodes (Conceptual) */}
      <group>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (i & 1 ? 1 : -1) * (size / 2 - padding / 2),
              (i & 2 ? 1 : -1) * (size / 2 - padding / 2),
              (i & 4 ? 1 : -1) * (size / 2 - padding / 2)
            ]}
          >
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              emissive="#0ea5e9" 
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
