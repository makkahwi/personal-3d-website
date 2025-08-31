import { Sky, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";
import { useMemo, useState } from "react";
import * as THREE from "three";

import Ground from "./components/Ground";
import OliveTree from "./components/OliveTree";
import OuterInfiniteGround from "./components/OuterInfiniteGround";
import Player from "./components/Player";
import SceneControl from "./components/SceneControl";
import WallDoor from "./components/WallDoor";
import Walls from "./components/Walls";
import WallSconceRow from "./components/WallSconceRow";
import HobbiesZone from "./views/HobbiesZone";

/* =========================
   Types
========================= */

type MaterialParams = THREE.MeshStandardMaterialParameters;

type Materials = {
  grass: MaterialParams;
  wall: MaterialParams;
  trunk: MaterialParams;
  leaves: MaterialParams;
  path: MaterialParams;
  water: MaterialParams;
  wood: MaterialParams;
  dark: MaterialParams;
  red: MaterialParams;
};

/* =========================
   Main Scene
========================= */

const GardenScene = (): React.ReactElement => {
  const [isNight, setIsNight] = useState(false);
  const [walkMode, setWalkMode] = useState(false);

  // Materials as props objects to keep TSX happy & reusable
  const mats: Materials = useMemo(
    () => ({
      grass: { color: "#7c9c6e", roughness: 1 },
      trunk: { color: "#5a3e2b", roughness: 1 },
      leaves: {
        color: "#355e3b",
        roughness: 0.8,
        emissive: "#09150b",
        emissiveIntensity: 0.15,
      },
      wall: {
        color: "#c4b7a6",
        roughness: 0.9,
        emissive: "#1a1713",
        emissiveIntensity: 0.05,
      },
      path: { color: "#c2b280", roughness: 0.9 },
      water: {
        color: "#3a8fb7",
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      },
      wood: { color: "#8b5a2b", roughness: 0.9 },
      dark: { color: "#333333", roughness: 0.7 },
      red: { color: "#8b0000", roughness: 0.6 },
    }),
    []
  );

  return (
    <Canvas
      shadows
      camera={{ position: [0, 12, 20], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      {/* sky / stars */}
      {!isNight ? (
        <Sky
          distance={450000}
          sunPosition={[10, 20, 10]}
          inclination={0.49}
          azimuth={0.25}
        />
      ) : (
        <Stars
          radius={80}
          depth={20}
          count={3000}
          factor={2}
          saturation={0}
          fade
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={isNight ? 0.12 : 0.35} />

      <hemisphereLight
        color={isNight ? "#2a3d6b" : "#cfe7ff"}
        groundColor={isNight ? "#1f2b23" : "#8fb28a"}
        intensity={isNight ? 0.18 : 0.25}
      />

      {!isNight ? (
        <directionalLight
          position={[12, 18, 8]}
          intensity={1.2}
          color="#fffbe8"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
      ) : (
        <directionalLight
          position={[0, 50, 0]}
          intensity={0.5}
          color="#9db7ff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
      )}
      {/* First-person controls */}
      <Player enabled={walkMode} />
      {/* World */}
      <color attach="background" args={[isNight ? "#0c1222" : "#cfe7ff"]} />
      <fog attach="fog" args={[isNight ? "#0c1222" : "#cfe7ff", 120, 800]} />

      {/* Infinite outer floor */}
      <OuterInfiniteGround isNight={isNight} />

      <Ground mats={mats} />
      <Walls mats={mats} />
      <OliveTree mats={mats} />

      {/* Evenly distributed wall sconces on all walls */}
      <WallSconceRow wall="north" count={5} isNight={isNight} />
      <WallSconceRow wall="south" count={5} isNight={isNight} />
      <WallSconceRow wall="east" count={4} isNight={isNight} />
      <WallSconceRow wall="west" count={4} isNight={isNight} />

      <WallDoor position={[-18.9, 1.0, -24.5]} rotation={[0, Math.PI / 2, 0]} />

      <HobbiesZone origin={[-22.9, 0.01, -22.9]} isNight={isNight} />

      <SceneControl
        isNight={isNight}
        setIsNight={setIsNight}
        walkMode={walkMode}
        setWalkMode={setWalkMode}
      />
    </Canvas>
  );
};

export default GardenScene;
