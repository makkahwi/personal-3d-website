import * as React from "react";

import type { Vec3 } from "../types";

const VolleyBallCourt: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Court base */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 5]} />
      <meshStandardMaterial color="#e8d6b3" roughness={0.95} />
    </mesh>

    {/* Lines */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[0.05, 5]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>

    {/* Net */}
    <mesh position={[0, 2, 0]} rotation={[0, 1.55, 0]}>
      <planeGeometry args={[5, 1.2]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
    </mesh>

    {/* Poles */}
    <mesh castShadow position={[0, 1.25, 2.5]}>
      <cylinderGeometry args={[0.07, 0.08, 2.5, 12]} />
      <meshStandardMaterial color="#000" roughness={0.9} />
    </mesh>

    <mesh castShadow position={[0, 1.25, -2.5]}>
      <cylinderGeometry args={[0.07, 0.08, 2.75, 12]} />
      <meshStandardMaterial color="#000" roughness={0.9} />
    </mesh>
  </group>
);

export default VolleyBallCourt;
