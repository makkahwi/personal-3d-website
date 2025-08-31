import * as React from "react";

import type { Vec3 } from "../types";
import WoodFence from "../components/WoodFence";
import GardenLamp from "../components/GardenLamp";
import MultiPurposeTable from "./MultiPurposeTable";
import Signpost from "../components/SignPost";
import SwimmingPool from "../components/SwimmingPool";
import MotorCycle from "../components/MotorCycle";
import WalkingTrack from "../components/WalkingTrack";
import VolleyBallCourt from "../components/VolleyCourt";
import WallProjector from "../components/WallProjector";

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

      <WoodFence origin={[-2, 0.0001, -2]} size={[w, h]} />

      {/* physical lamp meshes */}
      <GardenLamp position={[-x - 5.5, 0, -1]} isNight={isNight} />
      <GardenLamp position={[-1, 0, y - 1]} isNight={isNight} />
      <GardenLamp position={[-z - 5.5, 0, -z - 5.5]} isNight={isNight} />
      <GardenLamp position={[-1, 0, -x - 5.5]} isNight={isNight} />

      <MultiPurposeTable
        position={[2, 0, 15.5]}
        topSize={[6.6, 1.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <MotorCycle position={[1.5, 0, -1.25]} />
      <Signpost position={[0.5, 0.02, 0.5]} />

      {/* layout (relative to origin) */}
      <SwimmingPool position={[12, 0.02, 12]} />
      <WalkingTrack position={[12, 0.02, 12]} />
      <VolleyBallCourt position={[12, 0.02, 2]} />

      {/* Projector mounted on the west wall of the zone (facing east) */}
      <WallProjector
        screenPos={[-1.55, 2, 12]}
        screenSize={[7, 3.5]}
        videoSrc={"/media/movies.mp4"}
        screenRotation={[0, 1.57, 0]}
      />
    </group>
  );
};

export default HobbiesZone;
