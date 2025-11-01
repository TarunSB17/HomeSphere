import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Loader, AlertCircle } from 'lucide-react';

const Model = ({ url }) => {
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1} />;
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return null;
  }
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-3" />
      <p className="text-gray-600">Loading 3D Model...</p>
    </div>
  </div>
);

const Model3DViewer = ({ modelUrl }) => {
  const [error, setError] = useState(false);

  console.log('Model3DViewer - Loading model from:', modelUrl);

  if (!modelUrl) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>No 3D model available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load 3D model</p>
          <p className="text-sm text-gray-500 mt-2">Check console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f3f4f6');
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setError(true);
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
            autoRotate={false}
          />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </Canvas>
    </div>
  );
};

export default Model3DViewer;
