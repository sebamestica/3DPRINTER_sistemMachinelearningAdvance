import * as THREE from 'three';
import type { CubeParameters, PreviewConfig } from '../types/design';

/**
 * RECONSTRUCTED GEOMETRY ENGINE v2 (FIX CACHE)
 * Generates physical architectures contained within a 5x5x5 cm volume.
 */

export const buildCubeDesign = (params: CubeParameters, preview: PreviewConfig) => {
  const group = new THREE.Group();
  const CUBE_SIZE = 5; 

  if (preview.showShell) {
    const shellGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const shellMat = new THREE.MeshPhysicalMaterial({ 
      color: '#ffffff', 
      transparent: true, 
      opacity: preview.renderMode === 'translucent' ? 0.3 : 0.05, 
      roughness: 0.2, 
      transmission: 0.6,
      depthWrite: false
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    group.add(shellMesh);
  }

  const internalGroup = generateInternalArchitecture(params, preview);
  group.add(internalGroup);

  return group;
};

const generateInternalArchitecture = (params: CubeParameters, preview: PreviewConfig) => {
  const container = new THREE.Group();
  
  const cellCount = Math.min(20, Math.floor(params.cellSize * 5));
  const cellSize = 5 / cellCount;
  const strutSize = params.strutThickness * 2;

  const getMatColor = (risk: 'high' | 'medium' | 'low' = 'low') => {
    if (preview.renderMode === 'wireframe') return '#444444';
    if (risk === 'high') return '#ef4444'; 
    if (risk === 'medium') return '#f59e0b'; 
    return params.material === 'PLA' ? '#3b82f6' : params.material === 'TPU' ? '#8b5cf6' : '#10b981';
  };

  const buildBaseGeometry = () => {
     switch (params.geometry) {
        case 'solid': return new THREE.BoxGeometry(cellSize, cellSize, cellSize);
        case 'honeycomb': return new THREE.CylinderGeometry(cellSize/2, cellSize/2, strutSize, 6);
        case 'gyroid': return new THREE.TorusGeometry(cellSize/3, strutSize/2, 12, 24);
        case 'lattice': return new THREE.OctahedronGeometry(cellSize/2, 0);
        case 'cubic': return new THREE.BoxGeometry(cellSize, cellSize, cellSize);
        case 'octet': return new THREE.TetrahedronGeometry(cellSize/2);
        default: return new THREE.SphereGeometry(strutSize, 8, 8);
     }
  };

  const geo = buildBaseGeometry();

  for (let x = 0; x < cellCount; x++) {
    for (let y = 0; y < cellCount; y++) {
      for (let z = 0; z < cellCount; z++) {
        
        const filter = Math.sin(x*y*z) * 100;
        if (filter < params.infill) {
           const riskLevel = z < cellCount/4 ? 'medium' : 'low';
           const mat = new THREE.MeshStandardMaterial({ 
             color: getMatColor(riskLevel), 
             metalness: 0.1, 
             roughness: 0.6,
             wireframe: preview.renderMode === 'wireframe'
           });
           
           const mesh = new THREE.Mesh(geo, mat);
           mesh.position.set(
              (x - (cellCount-1)/2) * cellSize,
              (y - (cellCount-1)/2) * cellSize,
              (z - (cellCount-1)/2) * cellSize
           );
           
           if (params.geometry === 'honeycomb') mesh.rotation.x = Math.PI / 2;
           if (params.geometry === 'gyroid') mesh.rotation.set(Math.random(), Math.random(), 0);
           
           container.add(mesh);
        }
      }
    }
  }

  return container;
};
