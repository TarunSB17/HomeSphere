import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
};

const Model3DModal = ({ modelUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-3/4 m-4 flex flex-col border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">3D Property Tour</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close 3D modal"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 relative">
          {modelUrl ? (
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="bg-white dark:bg-gray-900 transition-colors">
              <Suspense fallback={null}>
                <Environment preset="apartment" />
                <Model url={modelUrl} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
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
