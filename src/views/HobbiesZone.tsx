import * as React from "react";
import type { Vec3 } from "../types";
import Signpost from "../components/SignPost";
import SwimmingPool from "../components/SwimmingPool";

const HobbiesZone: React.FC<{ origin?: Vec3; isNight: boolean }> = ({
  origin = [-14, 0, -6],
  isNight = false,
}) => {
  // A subtle base patch so the “zone” reads as one area
  const [x, y, z] = origin;

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
