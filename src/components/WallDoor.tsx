import * as React from "react";
import type { Vec3 } from "../types";

const WallDoor: React.FC<{ position: Vec3; rotation?: Vec3 }> = ({
  position,
  rotation = [0, Math.PI / 2, 0],
}) => (
  <group position={position} rotation={rotation}>
    {/* Frame */}
    <mesh castShadow>
      <boxGeometry args={[0.12, 2.2, 1.1]} />
      <meshStandardMaterial color="#d2c7b6" roughness={0.9} />
    </mesh>
    {/* Door slab */}
    <mesh castShadow position={[0.06, 0, 0]}>
      <boxGeometry args={[0.04, 2, 0.9]} />
      <meshStandardMaterial color="#5e4a3a" roughness={0.9} />
    </mesh>
    {/* Handle */}
    <mesh castShadow position={[0.08, 0, 0.3]}>
      <cylinderGeometry args={[0.03, 0.03, 0.16, 12]} />
      <meshStandardMaterial color="#c9b37a" roughness={0.5} metalness={0.6} />
    </mesh>
  </group>
);

export default WallDoor;
