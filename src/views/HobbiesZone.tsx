import * as React from "react";

import MotorCycle from "../components/MotorCycle";
import SwimmingPool from "../components/SwimmingPool";
import VolleyBallCourt from "../components/VolleyCourt";
import WalkingTrack from "../components/WalkingTrack";
import WallProjector from "../components/WallProjector";

import type { Vec3 } from "../types";
import MultiPurposeTable from "./MultiPurposeTable";
import MiniaturePark from "./MiniaturePark";

const HobbiesZone: React.FC<{ origin?: Vec3; isNight: boolean }> = ({
  origin = [-8, 0.01, -20.5],
}) => {
  // A subtle base patch so the “zone” reads as one area
  return (
    <group position={origin}>
      {/* zone base
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[8, 0.005, 8]}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#9ab38c" roughness={1} />
      </mesh> */}

      <MultiPurposeTable
        position={[-12, 0, 7.5]}
        topSize={[6.6, 1.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <MotorCycle position={[1.5, 0, -3.5]} />

      {/* layout (relative to origin) */}
      <SwimmingPool position={[-3, 0.02, 12]} />
      <WalkingTrack position={[-3, 0.02, 12]} />
      <VolleyBallCourt position={[5, 0.02, 1]} />

      {/* Projector mounted on the west wall of the zone (facing east) */}
      <WallProjector
        screenPos={[-16.45, 2, 4]}
        screenSize={[7, 3.5]}
        videoSrc={"/media/movies.mp4"}
        screenRotation={[0, 1.57, 0]}
      />

      <MiniaturePark position={[22.5, 0, 6.5]} />
    </group>
  );
};

export default HobbiesZone;
