import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const resolveModelUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  // If base ends with /api and url begins with /api, avoid duplicating
  const baseNoApi = base.replace(/\/api$/i, '');
  return `${baseNoApi}${url}`;
};

const Model = ({ url }) => {
  const resolved = resolveModelUrl(url);
  const { scene } = useGLTF(resolved);
  const { camera } = useThree();

  const fitted = useMemo(() => {
    const clone = scene.clone(true);
    // Compute bounding box and center/scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center); // center at origin

    // Fit model into a target size
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 2.0; // target size in world units
    const scale = target / maxDim;
    clone.scale.setScalar(scale * 1.2); // slightly larger

    // Adjust camera distance for better framing
    const dist = 3.0;
    camera.position.set(0, 0, dist);
    camera.near = 0.01;
    camera.far = 1000;
    camera.updateProjectionMatrix();

    return clone;
  }, [scene, camera]);

  return <primitive object={fitted} />;
};

const Model3DModal = ({ modelUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-3/4 m-4 flex flex-col border border-gray-800 transition-colors">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">3D Property Tour</h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
            aria-label="Close 3D modal"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 relative">
          {modelUrl ? (
            <Canvas camera={{ position: [0, 0, 3], fov: 40 }} className="bg-gray-900 transition-colors">
              <Suspense fallback={<Html center><div className="text-gray-700 dark:text-gray-200">Loading 3D...</div></Html>}>
                {/* Force dark renderer background for contrast in all themes */}
                {/* eslint-disable-next-line react/no-unknown-property */}
                <color attach="background" args={["#0b1220"]} />
                <Environment preset="apartment" />
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <Model url={modelUrl} />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1}
                  maxDistance={10}
                  enableDamping
                  dampingFactor={0.08}
                />
              </Suspense>
            </Canvas>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-600 dark:text-gray-400">3D model not available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model3DModal;
