import {
  Html,
  OrbitControls,
  PointerLockControls,
  Sky,
  Stars,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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

/* =========================
   Helpers
========================= */

// ADD: helper to make a checkerboard texture for the chess table
const useCheckerTexture = (size: number = 512, squares = 8) => {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const s = size / squares;

    for (let y = 0; y < squares; y++) {
      for (let x = 0; x < squares; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#f0f0f0" : "#2a2a2a";
        ctx.fillRect(x * s, y * s, s, s);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 8;
    return tex;
  }, [size, squares]);
};

/* =========================
   Reusable Station
========================= */

const Signpost: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => (
  <group position={position}>
    {/* pole */}
    <mesh castShadow>
      <cylinderGeometry args={[0.07, 0.08, 5.2, 12]} />
      <meshStandardMaterial color="#655a4a" roughness={0.9} />
    </mesh>
    {/* arms */}
    {[
      { y: 0.9, rotY: 0.0, label: "Makkah →" },
      { y: 1.3, rotY: Math.PI / 3, label: "Malaysia →" },
      { y: 1.7, rotY: -Math.PI / 4, label: "Jordan →" },
    ].map((a, i) => (
      <group key={i} rotation={[0, a.rotY, 0]} position={[0, a.y, 0]}>
        <mesh castShadow position={[0.55, 0, 0]}>
          <boxGeometry args={[1.2, 0.2, 0.08]} />
          <meshStandardMaterial color="#d6c3a2" roughness={0.85} />
        </mesh>
        {a.label}
      </group>
    ))}
  </group>
);

// Reuse Vec3 type and useCheckerTexture hook you already have

/** Small sub-module: cooking area (grill + board) */
const CookingModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.45, 0],
}) => (
  <group position={offset}>
    {/* Grill block */}
    <mesh castShadow>
      <boxGeometry args={[0.9, 0.18, 0.6]} />
      <meshStandardMaterial color="#3b3b3b" roughness={0.7} metalness={0.2} />
    </mesh>
    {/* Grill lines */}
    {[...Array(6)].map((_, i) => (
      <mesh key={i} position={[-0.4 + i * 0.16, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.02, 0.58]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.6} />
      </mesh>
    ))}
    {/* Cutting board */}
    <mesh position={[0.65, 0.02, 0]}>
      <boxGeometry args={[0.6, 0.04, 0.4]} />
      <meshStandardMaterial color="#9a6b3d" roughness={0.9} />
    </mesh>
  </group>
);

/** Small sub-module: chess area */
const ChessModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.46, 0],
}) => {
  const checker = useCheckerTexture(512, 8);
  return (
    <group position={offset}>
      {/* board */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
        <meshStandardMaterial map={checker} roughness={0.85} />
      </mesh>
      {/* simple clock */}
      <mesh castShadow position={[0, 0.18, -0.55]}>
        <boxGeometry args={[0.24, 0.16, 0.12]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
    </group>
  );
};

/** Small sub-module: PC area (monitor + tower + keyboard) */
const PCModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.5, 0],
}) => (
  <group position={offset}>
    {/* monitor */}
    <mesh castShadow position={[0, 0.18, -0.18]}>
      <boxGeometry args={[0.9, 0.5, 0.06]} />
      <meshStandardMaterial
        color="#1b1b1b"
        roughness={0.6}
        metalness={0.2}
        emissive="#0a0a0a"
        emissiveIntensity={0.12}
      />
    </mesh>
    {/* stand */}
    <mesh castShadow position={[0, -0.05, -0.18]}>
      <boxGeometry args={[0.18, 0.1, 0.18]} />
      <meshStandardMaterial color="#2b2b2b" roughness={0.7} />
    </mesh>
    {/* keyboard */}
    <mesh castShadow position={[0.05, -0.08, 0.1]}>
      <boxGeometry args={[0.6, 0.04, 0.18]} />
      <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
    </mesh>
    {/* tower */}
    <mesh castShadow position={[-0.9, 0.08, 0.28]}>
      <boxGeometry args={[0.32, 0.6, 0.48]} />
      <meshStandardMaterial color="#232323" roughness={0.75} />
    </mesh>
  </group>
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
  const Leg = ({ x, z }: { x: number; z: number }) => (
    <mesh castShadow position={[x, 0.4, z]}>
      <boxGeometry args={[0.14, 0.8, 0.14]} />
      <meshStandardMaterial color="#6c5646" roughness={0.9} />
    </mesh>
  );

  // partition markers between zones
  const Divider = ({ x }: { x: number }) => (
    <mesh castShadow position={[x, 0.55, 0]}>
      <boxGeometry args={[0.04, 0.2, D - 0.1]} />
      <meshStandardMaterial color="#7a6a59" roughness={0.9} />
    </mesh>
  );

  return (
    <group position={position} rotation={rotation}>
      {/* table top */}
      <mesh castShadow receiveShadow position={[L / 2, 0.6, 0]}>
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
      <CookingModule offset={[L * (1 / 6), 0.6, 0]} />
      <Divider x={L / 3} />

      {/* chess block centered in second third */}
      <ChessModule offset={[L * (3 / 6), 0.6, 0]} />
      <Divider x={(2 * L) / 3} />

      {/* pc block centered in last third */}
      <PCModule offset={[L * (5 / 6), 0.6, 0]} />
    </group>
  );
};

const WoodFence: React.FC<{
  origin: [number, number, number];
  size: [number, number];
  gap?: number;
}> = ({ origin, size, gap = 2.4 }) => {
  const [w, h] = size;
  const [ox, oy, oz] = origin; // bottom-left of the fence area
  const posts: React.ReactElement[] = [];

  // perimeter posts
  for (let x = 0; x <= w; x += gap) {
    posts.push(<FencePost key={`n-${x}`} position={[ox + x, oy, oz + h]} />);
  }
  for (let z = 0; z <= h; z += gap) {
    posts.push(<FencePost key={`e-${z}`} position={[ox + w, oy, oz + z]} />);
  }

  const factor = 10;

  // rails (two per side)
  return (
    <group>
      {posts}
      {/* north rail */}
      <FenceRail
        from={[ox + factor, oy + 0.6, oz + h - factor]}
        to={[ox + w + factor, oy + 0.6, oz + h - factor]}
      />
      {/* east rail */}
      <FenceRail
        from={[ox + w - factor, oy + 0.6, oz + factor]}
        to={[ox + w - factor, oy + 0.6, oz + h + factor]}
      />
    </group>
  );
};

const FencePost: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => (
  <mesh position={position} castShadow>
    <boxGeometry args={[0.12, 1.2, 0.12]} />
    <meshStandardMaterial color="#6a533f" roughness={0.9} />
  </mesh>
);

const FenceRail: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
}> = ({ from, to }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const rotY = Math.atan2(dir.x, dir.z);
  return (
    <mesh position={[mid.x, mid.y, mid.z]} rotation={[0, rotY, 0]} castShadow>
      <boxGeometry args={[len, 0.08, 0.08]} />
      <meshStandardMaterial color="#7a5e46" roughness={0.9} />
    </mesh>
  );
};

/** Pool: border + water plane */
const SmallPool: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Border */}
    <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 5, 64, 1]} />
      <meshStandardMaterial color="#cfc7b5" roughness={0.9} />
    </mesh>
    {/* Water (slightly inset) */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[4.5, 48]} />
      <meshStandardMaterial
        color="#5daed1"
        transparent
        opacity={0.85}
        roughness={0.25}
        metalness={0.05}
      />
    </mesh>
  </group>
);

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

/** Door mounted in the wall (east wall example) */
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

/** A single wall sconce: small fixture + warm point light */
const WallSconce = ({
  position,
  facing = "in",
  color = "#ffd7a0",
  intensity = 500,
  distance = 6,
  isNight = false,
}: {
  position: [number, number, number];
  facing?: "in" | "out";
  color?: string;
  intensity?: number;
  distance?: number;
  isNight: boolean;
}) => {
  return (
    <group position={position}>
      {/* fixture */}
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.28, 0.12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
      </mesh>

      {/* glow plate */}
      <mesh position={[0, 0, facing === "in" ? 0.08 : -0.08]}>
        <planeGeometry args={[0.2, 0.3]} />
        <meshStandardMaterial
          color="#fff4e4"
          emissive="#c28e46"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* ambient fill (no shadows) */}
      <pointLight
        position={[0, 0, facing === "in" ? 0.15 : -0.15]}
        color={color}
        intensity={isNight ? intensity : 0}
        distance={distance}
        decay={2}
        castShadow={false}
      />
    </group>
  );
};

/** Evenly distributes sconces along one wall */
const WallSconceRow = ({
  wall,
  count = 5,
  y = 5,
  isNight = false,
}: {
  wall: "north" | "south" | "east" | "west";
  count?: number;
  y?: number;
  isNight: boolean;
}) => {
  // inner wall plane extents ~[-25,25], pull in a bit so they sit visually on walls
  const margin = 24.6;
  const step = (2 * margin) / (count - 1);

  const items = Array.from({ length: count }).map((_, i) => {
    const t = -margin + i * step;
    switch (wall) {
      case "north": // z = -25
        return (
          <WallSconce key={i} position={[t, y, -24.9]} isNight={isNight} />
        );
      case "south": // z = 25
        return <WallSconce key={i} position={[t, y, 24.9]} isNight={isNight} />;
      case "east": // x = 25
        return <WallSconce key={i} position={[24.9, y, t]} isNight={isNight} />;
      case "west": // x = -25
      default:
        return (
          <WallSconce key={i} position={[-24.9, y, t]} isNight={isNight} />
        );
    }
  });

  return <>{items}</>;
};

const GardenLamp = ({
  position,
  isNight,
}: {
  position: [number, number, number];
  isNight: boolean;
}) => {
  // pole + bulb + point light
  return (
    <group position={position}>
      <pointLight
        position={[position[0], 2, position[2]]}
        intensity={isNight ? 11 : 0}
        distance={9}
        decay={2}
        color="#ffd9a1"
        castShadow
      />

      {/* pole */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.12, 2.2, 12]} />
        <meshStandardMaterial color="#474747" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      {/* bulb */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          emissive="#000000"
          emissiveIntensity={0.0}
          color="#dddddd"
        />
      </mesh>
    </group>
  );
};

/* =========================
   World Pieces
========================= */

const Ground = ({ mats }: { mats: Materials }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial {...mats.grass} />
    </mesh>
  );
};

const OuterInfiniteGround = ({ isNight }: { isNight: boolean }) => {
  // Slightly darker/desaturated than inner grass so the courtyard still “reads” as special
  const color = isNight ? "#0f1a10" : "#c2b280";
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]} // tiny offset to avoid z-fighting with inner ground
      receiveShadow
    >
      <planeGeometry args={[4000, 4000]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
};

const Walls = ({ mats }: { mats: Materials }) => {
  const sides = ["north", "south", "east", "west"] as const;
  const positions: Record<(typeof sides)[number], Vec3> = {
    north: [0, 2.5, -25],
    south: [0, 2.5, 25],
    east: [25, 2.5, 0],
    west: [-25, 2.5, 0],
  };
  const rotations: Record<(typeof sides)[number], Vec3> = {
    north: [0, 0, 0],
    south: [0, 0, 0],
    east: [0, Math.PI / 2, 0],
    west: [0, Math.PI / 2, 0],
  };

  return (
    <>
      {sides.map((side) => (
        <mesh
          key={side}
          position={positions[side]}
          rotation={rotations[side]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[50, 5, 1]} />
          <meshStandardMaterial {...mats.wall} />
        </mesh>
      ))}
    </>
  );
};

const OliveTree = ({ mats }: { mats: Materials }) => {
  return (
    <>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <meshStandardMaterial {...mats.trunk} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 24, 24]} />
        <meshStandardMaterial {...mats.leaves} />
      </mesh>
    </>
  );
};

/* =========================
   First-person Player
========================= */

const Player = ({
  enabled,
  bounds = 24.2,
  speed = 5,
}: {
  enabled: boolean;
  bounds?: number;
  speed?: number;
}) => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (enabled) {
      camera.position.set(0, 1.7, 18);
      camera.lookAt(0, 1.7, 0);
    }
  }, [enabled, camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    if (!enabled) return;

    const dir = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

    if (keys.current["KeyW"]) dir.add(forward);
    if (keys.current["KeyS"]) dir.sub(forward);
    if (keys.current["KeyA"]) dir.sub(right);
    if (keys.current["KeyD"]) dir.add(right);

    if (dir.lengthSq() > 0) {
      dir.normalize();
      camera.position.addScaledVector(dir, speed * dt);
    }

    // keep within walls
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -bounds,
      bounds
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -bounds,
      bounds
    );

    // avoid center trunk (simple radial push)
    const r = Math.hypot(camera.position.x, camera.position.z);
    const minR = 2.0;
    if (r < minR) {
      const scale = minR / (r || 0.0001);
      camera.position.x *= scale;
      camera.position.z *= scale;
    }
  });

  return enabled ? <PointerLockControls selector="#click-to-lock" /> : null;
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
      <SmallPool position={[12, 0.02, 12]} />
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
