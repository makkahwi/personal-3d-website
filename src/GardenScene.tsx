import { Html, OrbitControls, Sky, Stars } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Ground from "./components/Ground";
import OliveTree from "./components/OliveTree";
import OuterInfiniteGround from "./components/OuterInfiniteGround";
import Player from "./components/Player";
import Signpost from "./components/SignPost";
import SwimmingPool from "./components/SwimmingPool";
import WallDoor from "./components/WallDoor";
import Walls from "./components/Walls";
import WallSconceRow from "./components/WallSconceRow";
import WoodFence from "./components/WoodFence";
import GardenLamp from "./components/GardenLamp";
import MultiPurposeTable from "./views/MultiPurposeTable";

/* =========================
   Types
========================= */

type Vec3 = [number, number, number];

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

/** Walking track (مسار مشي): flattened torus */
const WalkingTrack: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh receiveShadow>
      <torusGeometry args={[5.2, 0.25, 16, 64]} />
      <meshStandardMaterial color="#bda781" roughness={0.95} />
    </mesh>
  </group>
);

/** Motorcycle placeholder (wheels + body) near a Door */
const MotoSpot: React.FC<{ position: Vec3 }> = ({ position }) => (
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

/** Volleyball mini-court + net */
const VolleyCourt: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Court base */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 5]} />
      <meshStandardMaterial color="#e8d6b3" roughness={0.95} />
    </mesh>
    {/* Lines */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[0.05, 5]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    {/* Net */}
    <mesh position={[0, 2, 0]} rotation={[0, 1.55, 0]}>
      <planeGeometry args={[5, 1.2]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
    </mesh>
  </group>
);

/** Wall Projector: emits a video/GIF onto the wall */
const WallProjector: React.FC<{
  screenPos: [number, number, number]; // plane position on wall
  screenSize?: [number, number];
  videoSrc: string;
  screenRotation?: [number, number, number]; // NEW
}> = ({
  screenPos,
  screenSize = [3, 1.7],
  videoSrc,
  screenRotation = [0, 0, 0],
}) => {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = videoSrc;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    return v;
  }, [videoSrc]);

  useEffect(() => {
    // Autoplay (user gesture may be required in some browsers; clicking page will start it)
    video.play().catch(() => {});
  }, [video]);

  const texture = useMemo(() => new THREE.VideoTexture(video), [video]);

  return (
    <group>
      <mesh castShadow position={[2, 0.75, 12]}>
        <boxGeometry args={[0.4, 0.25, 0.25]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      {/* mount on wall */}
      <mesh
        position={screenPos}
        rotation={screenRotation}
        castShadow
        receiveShadow
      >
        <planeGeometry args={screenSize} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* =========================
   Zones
========================= */

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

      <MotoSpot position={[1.5, 0, -1.25]} />
      <Signpost position={[0.5, 0.02, 0.5]} />

      {/* layout (relative to origin) */}
      <SwimmingPool position={[12, 0.02, 12]} />
      <WalkingTrack position={[12, 0.02, 12]} />
      <VolleyCourt position={[12, 0.02, 2]} />

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

  const Hud = () => {
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const { camera } = useThree();
    const resetCamera = () => {
      setWalkMode(false);
      camera.position.set(0, 12, 20);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.target.set(0, 0, 0);
      controlsRef.current?.update();
    };
    return (
      <>
        {!walkMode && (
          <OrbitControls
            ref={controlsRef as React.MutableRefObject<OrbitControlsImpl>}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={40}
            enableDamping
            dampingFactor={0.06}
          />
        )}
        <Html fullscreen>
          <div
            id="click-to-lock"
            style={{
              position: "fixed",
              top: "auto",
              right: "auto",
              display: "flex",
              padding: 10,
              gap: 8,
              zIndex: 10,
              userSelect: "none",
            }}
          >
            <button
              onClick={() => setIsNight((v) => !v)}
              style={btnStyle}
              title="Toggle day/night"
            >
              {isNight ? "Day Mode" : "Night Mode"}
            </button>
            <button
              onClick={() => setWalkMode((v) => !v)}
              style={btnStyle}
              title="Toggle Walk/Orbit"
            >
              {walkMode ? "Orbit Mode" : "Walk Mode"}
            </button>
            <button onClick={resetCamera} style={btnStyle} title="Reset camera">
              Reset Camera
            </button>
          </div>

          {walkMode && (
            <div
              style={{
                position: "fixed",
                left: "auto",
                bottom: "auto",
                margin: 10,
                padding: "8px 10px",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <div>
                <b>Walk mode</b>: Click scene to lock cursor
              </div>
              <div>Move: W A S D — Look: Mouse — Exit: Esc</div>
            </div>
          )}
        </Html>
      </>
    );
  };

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
      {/* background color */}
      <color attach="background" args={[isNight ? "#0c1222" : "#cfe7ff"]} />

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

      <fog attach="fog" args={[isNight ? "#0c1222" : "#cfe7ff", 45, 90]} />

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
      {/* Background + atmospheric fade (optional but recommended) */}
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

      {/* HUD */}
      <Hud />
    </Canvas>
  );
};

export default GardenScene;

/* =========================
   Styles
========================= */

const btnStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "#fff",
  cursor: "pointer",
};
