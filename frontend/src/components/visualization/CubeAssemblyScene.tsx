import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera, Center } from '@react-three/drei';
import { Suspense } from 'react';
import { OuterShell } from './OuterShell';
import { InternalStructure } from './InternalStructure';
import { CompressionPlates } from './CompressionPlates';
import { CompressionArrows } from './CompressionArrows';
import type { InputParameters } from '../../types/model';

interface Props {
  parameters: InputParameters;
}

export function CubeAssemblyScene({ parameters }: Props) {
  // Use a scale that reflects 5cm but comfortable for Viewport (1 Unit = 1 cm)
  const cubeSize = 5;

  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl">
      {/* 1. Dimensions/Context Label */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase italic">
            Prototipo Digital Estructural
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-px w-3 bg-zinc-600" /> Dim: 5x5x5 cm
          </span>
          <span className="flex items-center gap-1 lowercase">
            <span className="h-px w-3 bg-zinc-600" /> Escala: 1:1
          </span>
        </div>
      </div>

      {/* 2. Three.js Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[8, 7, 8]} fov={35} />
        
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-8, 12, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <Center top>
            <group position={[0, cubeSize / 2, 0]}>
              {/* Main Cube Components */}
              <OuterShell parameters={parameters} size={cubeSize} />
              
              <InternalStructure 
                parameters={parameters} 
                size={cubeSize} 
              />

              {/* Interaction/Environment Elements */}
              <CompressionPlates 
                visualMode={parameters.visualMode} 
                size={cubeSize}
              />
              
              <CompressionArrows 
                level={parameters.compressionLevel} 
                size={cubeSize}
              />
            </group>
          </Center>

          {/* Technical Grid/Ground */}
          <Grid
            args={[30, 30]}
            cellSize={1}
            cellThickness={0.8}
            sectionSize={5}
            sectionThickness={1.2}
            fadeDistance={40}
            fadeStrength={1}
            cellColor="#3f3f46"
            sectionColor="#71717a"
            infiniteGrid
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={10}
          maxDistance={25}
          autoRotate={parameters.visualMode === 'solid'}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* 3. Visual Legend (HUD Style) */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <div className="rounded-lg bg-black/60 px-3 py-2 border border-white/10 backdrop-blur-md">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-tighter">
            Ejes de Referencia
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500" /> X
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Y (Carga)
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
               <span className="w-2 h-2 rounded-full bg-green-500" /> Z
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
