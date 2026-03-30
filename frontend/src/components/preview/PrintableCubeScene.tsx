import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Center, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { buildCubeDesign } from '../../lib/geometryEngine';
import type { CubeParameters, PreviewConfig } from '../../types/design';

interface PrintableCubeSceneProps {
  parameters: CubeParameters;
  preview: PreviewConfig;
}

export function PrintableCubeScene({ parameters, preview }: PrintableCubeSceneProps) {
  const cubeDesign = useMemo(() => buildCubeDesign(parameters, preview), [parameters, preview]);

  // Handle Layer Slicing (Conceptual)
  // We use a clipping plane to simulate the layer view
  const clipPlaneHeight = (preview.currentLayer / preview.totalLayers) * 5 - 2.5; // range -2.5 to 2.5
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), clipPlaneHeight), [clipPlaneHeight]);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas 
        shadows 
        gl={{ antialias: true, localClippingEnabled: true }}
        camera={{ position: [10, 10, 10], fov: 45 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#020202']} />
          <PerspectiveCamera makeDefault position={[12, 12, 12]} />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <Environment preset="city" />

          <Center top>
             <primitive object={cubeDesign}>
                <meshStandardMaterial attach="material" clippingPlanes={[clippingPlane]} />
             </primitive>
          </Center>

          {/* Technical Environment */}
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            fadeStrength={5} 
            cellSize={1} 
            sectionSize={5} 
            sectionColor="#3b82f6" 
            sectionThickness={1.5}
            cellColor="#111"
            cellThickness={0.5}
          />

          <OrbitControls 
            makeDefault 
            enablePan={true} 
            enableZoom={true} 
            minDistance={8} 
            maxDistance={25}
            dampingFactor={0.05}
          />

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
             <GizmoViewport axisColors={['#f87171', '#34d399', '#60a5fa']} labelColor="white" />
          </GizmoHelper>
        </Suspense>
      </Canvas>

      {/* Layer Label Overlay */}
      <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-2xl pointer-events-none space-y-1">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Inspección de Capas</span>
         <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white italic tracking-tighter">Layer {preview.currentLayer}</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">/ {preview.totalLayers} h_LOD</span>
         </div>
      </div>
    </div>
  );
}
