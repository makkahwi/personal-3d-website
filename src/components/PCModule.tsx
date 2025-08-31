import * as React from "react";

/** Small sub-module: PC area (monitor + tower + keyboard) */
const PCModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.5, 0],
}) => (
  <group position={offset}>
    {/* monitor */}
    <mesh castShadow position={[0, 0.18, -0.18]}>
      <boxGeometry args={[0.9, 0.5, 0.06]} />
      <meshStandardMaterial
        color="#1b1b1b"
        roughness={0.6}
        metalness={0.2}
        emissive="#0a0a0a"
        emissiveIntensity={0.12}
      />
    </mesh>
    {/* stand */}
    <mesh castShadow position={[0, -0.05, -0.18]}>
      <boxGeometry args={[0.18, 0.1, 0.18]} />
      <meshStandardMaterial color="#2b2b2b" roughness={0.7} />
    </mesh>
    {/* keyboard */}
    <mesh castShadow position={[0.05, -0.08, 0.1]}>
      <boxGeometry args={[0.6, 0.04, 0.18]} />
      <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
    </mesh>
    {/* tower */}
    <mesh castShadow position={[-0.9, 0.08, 0.28]}>
      <boxGeometry args={[0.32, 0.6, 0.48]} />
      <meshStandardMaterial color="#232323" roughness={0.75} />
    </mesh>
  </group>
);

export default PCModule;
