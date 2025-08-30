import * as React from "react";
import type { Vec3 } from "../types";

const SwimmingPool: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Border */}
    <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 5, 64, 1]} />
      <meshStandardMaterial color="#cfc7b5" roughness={0.9} />
    </mesh>
    {/* Water (slightly inset) */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[4.5, 48]} />
      <meshStandardMaterial
        color="#5daed1"
        transparent
        opacity={0.85}
        roughness={0.25}
        metalness={0.05}
      />
    </mesh>
  </group>
);

export default SwimmingPool;
