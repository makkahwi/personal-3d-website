import * as React from "react";

import type { Vec3 } from "../types";

const MotorCycle: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Wheels */}
    <mesh castShadow position={[-0.6, 0.4, 0]}>
      <torusGeometry args={[0.35, 0.09, 12, 24]} />
      <meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
    </mesh>
    <mesh castShadow position={[0.7, 0.4, 0]}>
      <torusGeometry args={[0.35, 0.09, 12, 24]} />
      <meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Body */}
    <mesh castShadow position={[0.05, 0.8, 0]}>
      <boxGeometry args={[1.3, 0.3, 0.4]} />
      <meshStandardMaterial color="#a52828" roughness={0.6} />
    </mesh>
    <mesh castShadow position={[0.25, 0.95, 0]}>
      <boxGeometry args={[0.5, 0.15, 0.35]} />
      <meshStandardMaterial color="#202020" roughness={0.7} />
    </mesh>
  </group>
);

export default MotorCycle;
