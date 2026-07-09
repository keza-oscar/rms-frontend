import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

function DataCube({ label, value, color }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <Box args={[1.5, 1.5, 1.5]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} wireframe={false} />
      </Box>
      <Text position={[0, 0, 1]} fontSize={0.3} color="#fff" anchorX="center" anchorY="middle">
        {label}
      </Text>
      <Text position={[0, -0.3, 1]} fontSize={0.4} color={color} anchorX="center" anchorY="middle" fontWeight="bold">
        {value}
      </Text>
    </group>
  );
}

function StatCube({ label, value, color = '#d4a574' }) {
  return (
    <div style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <DataCube label={label} value={value} color={color} />
        <color attach="background" args={['#0f1419']} />
      </Canvas>
    </div>
  );
}

export default StatCube;