import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Icosahedron, Float } from '@react-three/drei';

function CoreNode() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <Icosahedron args={[1.5, 1]}>
          <meshBasicMaterial color="#00FF9D" wireframe={true} opacity={0.3} transparent={true} />
        </Icosahedron>
        <Sphere args={[1.2, 32, 32]}>
          <MeshDistortMaterial
            color="#00F0FF"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2}
            opacity={0.8}
            transparent={true}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

export default function Nexus3DNode() {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00F0FF" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00FF9D" />
        <CoreNode />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
