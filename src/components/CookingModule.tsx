import * as React from "react";

/** Small sub-module: cooking area (grill + board) */
const CookingModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.45, 0],
}) => (
  <group position={offset}>
    {/* Grill block */}
    <mesh castShadow>
      <boxGeometry args={[0.9, 0.18, 0.6]} />
      <meshStandardMaterial color="#3b3b3b" roughness={0.7} metalness={0.2} />
    </mesh>
    {/* Grill lines */}
    {[...Array(6)].map((_, i) => (
      <mesh key={i} position={[-0.4 + i * 0.16, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.02, 0.58]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.6} />
      </mesh>
    ))}
    {/* Cutting board */}
    <mesh position={[0.65, 0.02, 0]}>
      <boxGeometry args={[0.6, 0.04, 0.4]} />
      <meshStandardMaterial color="#9a6b3d" roughness={0.9} />
    </mesh>
  </group>
);

export default CookingModule;
