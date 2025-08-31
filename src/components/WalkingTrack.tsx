import * as React from "react";

import type { Vec3 } from "../types";

const WalkingTrack: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh receiveShadow>
      <torusGeometry args={[5.2, 0.25, 16, 64]} />
      <meshStandardMaterial color="#bda781" roughness={0.95} />
    </mesh>
  </group>
);
export default WalkingTrack;
