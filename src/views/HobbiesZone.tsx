import * as React from "react";

import GardenLamp from "../components/GardenLamp";
import MotorCycle from "../components/MotorCycle";
import Signpost from "../components/SignPost";
import SwimmingPool from "../components/SwimmingPool";
import VolleyBallCourt from "../components/VolleyCourt";
import WalkingTrack from "../components/WalkingTrack";
import WallProjector from "../components/WallProjector";

import type { Vec3 } from "../types";
import MultiPurposeTable from "./MultiPurposeTable";

const HobbiesZone: React.FC<{ origin?: Vec3; isNight: boolean }> = ({
  origin = [-22.9, 0.01, -8],
  isNight = false,
}) => {
  // A subtle base patch so the “zone” reads as one area
  const [x, y, z] = origin;

  const [w, h] = [30, 50];

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

      {/* physical lamp meshes */}
      <GardenLamp position={[-x - 5.5, 0, -16]} isNight={isNight} />
      <GardenLamp position={[-1, 0, y - 16]} isNight={isNight} />
      <GardenLamp position={[-z + 9.5, 0, -z + 24]} isNight={isNight} />
      <GardenLamp position={[-1, 0, -x + 9]} isNight={isNight} />

      <MultiPurposeTable
        position={[2, 0, -5]}
        topSize={[6.6, 1.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <MotorCycle position={[1.5, 0, -16.25]} />
      <Signpost position={[0.5, 0.02, 25.5]} />

      {/* layout (relative to origin) */}
      <SwimmingPool position={[12, 0.02, 0]} />
      <WalkingTrack position={[12, 0.02, 0]} />
      <VolleyBallCourt position={[12, 0.02, -13]} />

      {/* Projector mounted on the west wall of the zone (facing east) */}
      <WallProjector
        screenPos={[-1.55, 2, -8]}
        screenSize={[7, 3.5]}
        videoSrc={"/media/movies.mp4"}
        screenRotation={[0, 1.57, 0]}
      />
    </group>
  );
};

export default HobbiesZone;
