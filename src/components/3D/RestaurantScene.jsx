import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sphere, Box } from '@react-three/drei';


function RotatingBox() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#d4a574" metalness={0.7} roughness={0.2} />
    </Box>
  );
}

function FloatingSphere() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
      meshRef.current.rotation.z += 0.003;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[2, 0, 0]}>
      <meshStandardMaterial color="#27ae60" metalness={0.6} roughness={0.3} />
    </Sphere>
  );
}

function RestaurantScene() {
  return (
    <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <OrbitControls autoRotate autoRotateSpeed={4} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#d4a574" />
        
        {/* 3D Objects */}
        <RotatingBox />
        <FloatingSphere />
        
        {/* Background */}
        <color attach="background" args={['#0f1419']} />
      </Canvas>
    </div>
  );
}

export default RestaurantScene;