import * as React from "react";

import ChessModule from "../components/ChessModule";
import CookingModule from "../components/CookingModule";
import PCModule from "../components/PCModule";

import type { Vec3 } from "../types";

const Leg = ({ x, z }: { x: number; z: number }) => (
  <mesh castShadow position={[x, 0.4, z]}>
    <boxGeometry args={[0.14, 0.8, 0.14]} />
    <meshStandardMaterial color="#6c5646" roughness={0.9} />
  </mesh>
);

/** Long shared table with legs + 3 zones */
const MultiPurposeTable: React.FC<{
  position: Vec3; // table world position (left-front corner under the top)
  topSize?: [number, number]; // [length, depth]
  legInset?: number; // distance of legs from edges
  rotation?: [number, number, number];
}> = ({ position, topSize = [6.6, 1.6], legInset = 0.25, rotation }) => {
  const [L, D] = topSize;

  // helper to place a leg at local (x,z)

  // partition markers between zones
  const Divider = ({ x }: { x: number }) => (
    <mesh castShadow position={[x, 0.85, 0]}>
      <boxGeometry args={[0.04, 0.01, D - 0.1]} />
      <meshStandardMaterial color="#7a6a59" roughness={0.9} />
    </mesh>
  );

  return (
    <group position={position} rotation={rotation}>
      {/* table top */}
      <mesh castShadow receiveShadow position={[L / 2, 0.8, 0]}>
        <boxGeometry args={[L, 0.1, D]} />
        <meshStandardMaterial color="#7b634f" roughness={0.9} />
      </mesh>

      {/* legs */}
      <Leg x={legInset} z={-D / 2 + legInset} />
      <Leg x={L - legInset} z={-D / 2 + legInset} />
      <Leg x={legInset} z={D / 2 - legInset} />
      <Leg x={L - legInset} z={D / 2 - legInset} />

      {/* modules laid out left→right: Cooking | Chess | PC */}
      {/* cooking block centered in first third */}
      <CookingModule offset={[L * (1 / 6), 0.9, 0]} />
      <Divider x={(1.25 * L) / 3} />

      {/* chess block centered in second third */}
      <ChessModule offset={[L * (3.5 / 6), 0.82, 0]} />
      <Divider x={(2.05 * L) / 3} />

      <Divider x={(1.45 * L) / 3} />

      {/* pc block centered in last third */}
      <PCModule offset={[L * (5.5 / 6), 0.8, 0]} />
    </group>
  );
};

export default MultiPurposeTable;
