import * as React from "react";

import type { Vec3 } from "../types";

const HobbiesZone: React.FC<{ origin?: Vec3 }> = ({
  origin = [-14, 0, -6],
}) => {
  // A subtle base patch so the “zone” reads as one area
  const [w, h] = [20, 20];

  return (
    <group position={origin}>
      {/* zone base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[8, 0.005, 8]}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#9ab38c" roughness={1} />
      </mesh>
    </group>
  );
};

export default HobbiesZone;
