import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

function FlipCard({ item, onHover }) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = isHovered ? Math.PI : 0;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => {
        setIsHovered(true);
        onHover && onHover();
      }}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Front */}
      <Box args={[2, 2.5, 0.2]} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#252f3f" metalness={0.5} roughness={0.4} />
      </Box>
      
      {/* Back */}
      <Box args={[2, 2.5, 0.2]} position={[0, 0, -0.1]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Text */}
      <Text position={[0, 0.8, 0.15]} fontSize={0.3} color="#d4a574">
        {item.item_name}
      </Text>
      <Text position={[0, -0.8, 0.15]} fontSize={0.2} color="#b0b8c1">
        {item.price} TZS
      </Text>
    </group>
  );
}

function MenuCard3D({ items }) {
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {items && items.length > 0 && (
          <FlipCard item={items[0]} />
        )}
        
        <color attach="background" args={['#0f1419']} />
      </Canvas>
    </div>
  );
}

export default MenuCard3D;