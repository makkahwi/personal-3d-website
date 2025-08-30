import * as React from "react";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useCursor,
  PointerLockControls,
  Sky,
  Stars,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/* =========================
   Types
========================= */

type Vec3 = [number, number, number];

type StationDef = {
  id: string;
  pos: Vec3;
  label: string;
  body: string;
  mesh: (args: { mats: Materials }) => React.ReactNode;
};

type StationProps = {
  id: string;
  position: Vec3;
  label: string;
  body: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  showLabels: boolean;
  children: React.ReactNode;
};

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

/** Pool: border + water plane */
const SmallPool: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Border */}
    <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 3, 64, 1]} />
      <meshStandardMaterial color="#cfc7b5" roughness={0.9} />
    </mesh>
    {/* Water (slightly inset) */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[2.6, 48]} />
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

/** Outdoor cooking: counter + grill drum */
const CookingStation: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Counter */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.8, 1.4]} />
      <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
    </mesh>
    {/* Grill */}
    <mesh castShadow position={[-1.1, 0.6, 0]}>
      <cylinderGeometry args={[0.45, 0.45, 1.2, 24]} />
      <meshStandardMaterial color="#444" roughness={0.8} metalness={0.2} />
    </mesh>
  </group>
);

/** Desk + monitor (coding) */
const CodingDesk: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {/* Desk */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.7, 1]} />
      <meshStandardMaterial color="#55473a" roughness={0.9} />
    </mesh>
    {/* Monitor */}
    <mesh castShadow position={[0.2, 0.9, -0.25]}>
      <boxGeometry args={[0.9, 0.55, 0.06]} />
      <meshStandardMaterial
        color="#1e1e1e"
        roughness={0.6}
        metalness={0.2}
        emissive="#0a0a0a"
        emissiveIntensity={0.15}
      />
    </mesh>
    {/* Tower */}
    <mesh castShadow position={[-0.9, 0.45, 0.35]}>
      <boxGeometry args={[0.35, 0.7, 0.5]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
    </mesh>
  </group>
);

/** Walking track (مسار مشي): flattened torus */
const WalkingTrack: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh receiveShadow>
      <torusGeometry args={[3.2, 0.25, 16, 64]} />
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
      <planeGeometry args={[6, 3]} />
      <meshStandardMaterial color="#e8d6b3" roughness={0.95} />
    </mesh>
    {/* Lines */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[6, 0.05]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    {/* Net */}
    <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 1.2]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
    </mesh>
  </group>
);

/** Chess table + two seats */
const ChessSet: React.FC<{ position: Vec3 }> = ({ position }) => {
  const checker = useCheckerTexture(512, 8);
  return (
    <group position={position}>
      {/* Table */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.7, 24]} />
        <meshStandardMaterial color="#6c5646" roughness={0.9} />
      </mesh>
      {/* Top with checkerboard */}
      <mesh castShadow position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 48]} />
        <meshStandardMaterial map={checker} roughness={0.8} />
      </mesh>
      {/* Two simple chairs */}
      {[-0.9, 0.9].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 0.35, -0.15]}>
            <boxGeometry args={[0.4, 0.6, 0.06]} />
            <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Wall Projector: emits a video/GIF onto the wall */
const WallProjector: React.FC<{
  position: Vec3; // projector device
  screenPos: Vec3; // plane position on wall
  screenSize?: [number, number];
  videoSrc: string; // e.g. "/media/movies.mp4" or a GIF
}> = ({ position, screenPos, screenSize = [3, 1.7], videoSrc }) => {
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
      {/* Projector device */}
      <mesh castShadow position={position}>
        <boxGeometry args={[0.4, 0.25, 0.25]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      {/* Screen plane on wall */}
      <mesh position={screenPos} castShadow receiveShadow>
        <planeGeometry args={screenSize} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

const Station = ({
  id,
  position,
  label,
  body,
  selectedId,
  setSelectedId,
  showLabels,
  children,
}: StationProps) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1];
  const isOpen = selectedId === id;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const bob = hovered ? Math.sin(t * 3) * 0.07 : 0;
    groupRef.current.position.y = baseY + bob;

    const current = groupRef.current.scale.x;
    const target = hovered ? 1.06 : 1.0;
    const next = THREE.MathUtils.lerp(current, target, 0.2);
    groupRef.current.scale.set(next, next, next);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(isOpen ? null : id);
  };

  return (
    <group position={position} ref={groupRef}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {children}
      </group>

      {showLabels && (
        <Html distanceFactor={10} position={[0, 2.2, 0]} transform>
          <div
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: 12,
              whiteSpace: "nowrap",
              backdropFilter: "blur(2px)",
            }}
          >
            {label}
          </div>
        </Html>
      )}

      {isOpen && (
        <Html distanceFactor={10} position={[0, 3.2, 0]} transform>
          <div
            style={{
              maxWidth: 260,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.97)",
              color: "#222",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              lineHeight: 1.4,
              fontSize: 14,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
            <div style={{ marginBottom: 10 }}>{body}</div>
            <button
              onClick={() => setSelectedId(null)}
              style={{
                border: "none",
                background: "#2b6cb0",
                color: "white",
                padding: "6px 10px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </Html>
      )}
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

const GardenLamp = ({ position }: { position: [number, number, number] }) => {
  // pole + bulb + point light
  return (
    <group position={position}>
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
   Scene Content (data)
========================= */

const STATIONS: StationDef[] = [
  {
    id: "pond",
    pos: [-15, 0.5, 0],
    label: "Swimming / Walking",
    body: "I like swimming and long walks — quiet focus and movement. This pond anchors the active/peaceful side.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial {...mats.water} />
      </mesh>
    ),
  },
  {
    id: "moto",
    pos: [15, 1, 0],
    label: "Travel & Motorcycling",
    body: "Adventure and discovery. I enjoy traveling and motorcycling — curiosity, risk to learn, open roads.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 4]} />
        <meshStandardMaterial {...mats.red} />
      </mesh>
    ),
  },
  {
    id: "chess",
    pos: [0, 0.5, 15],
    label: "Chess & Strategy",
    body: "Thinking ahead, patterns, and strategy. Fits my interest in problem solving and mindful play.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial {...mats.dark} />
      </mesh>
    ),
  },
  {
    id: "cooking",
    pos: [0, 0.5, -15],
    label: "Cooking & Dishes",
    body: "Asian • Western • Middle Eastern (Persian/Arabic/Turkish). Food as culture and creativity.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial {...mats.wood} />
      </mesh>
    ),
  },
  {
    id: "coding",
    pos: [-8, 0.6, -8],
    label: "Coding for Fun",
    body: "I love tinkering — building small projects to learn. Organized physically & digitally.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.6, 1.6]} />
        <meshStandardMaterial {...mats.dark} />
      </mesh>
    ),
  },
  {
    id: "books",
    pos: [8, 0.8, -8],
    label: "Interests Shelf",
    body: "Diet & health, technology, religions, entrepreneurship, and public affairs (macro-economy, sociology).",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1.6, 0.6]} />
        <meshStandardMaterial {...mats.wall} />
      </mesh>
    ),
  },
  {
    id: "movies",
    pos: [-8, 0.6, 8],
    label: "Movies",
    body: "Mystery & mind-twisters (The Commuter, Hypnotic, Now You See Me, Knives Out, Den of Thieves) + political (Vice, Irresistible).",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.6, 0.2]} />
        <meshStandardMaterial {...mats.path} />
      </mesh>
    ),
  },
  {
    id: "roots",
    pos: [8, 0.5, 8],
    label: "Roots & Journey",
    body: "Makkah → Malaysia → Jordan. Palestinian roots. Switched fields: engineering → CS; careers: finance/secretariat → design → coding.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.6, 24]} />
        <meshStandardMaterial {...mats.path} />
      </mesh>
    ),
  },
];

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

const Paths = ({ mats }: { mats: Materials }) => {
  const positions: Vec3[] = [
    [-10, 0.01, 0],
    [10, 0.01, 0],
    [0, 0.01, -10],
    [0, 0.01, 10],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[8, 4]} />
          <meshStandardMaterial {...mats.path} />
        </mesh>
      ))}
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

const HobbiesZone: React.FC<{ origin?: Vec3 }> = ({
  origin = [-14, 0, -6],
}) => {
  // A subtle base patch so the “zone” reads as one area
  return (
    <group position={origin}>
      {/* zone base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[8, 0.005, 8]}
      >
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#9ab38c" roughness={1} />
      </mesh>

      {/* layout (relative to origin) */}
      <SmallPool position={[4, 0.02, 4]} />
      <CookingStation position={[12.5, 0.4, 3]} />
      <CodingDesk position={[11.5, 0.45, 11]} />
      <WalkingTrack position={[5, 0.02, 11]} />
      <MotoSpot position={[15, 0, 7.5]} />
      <VolleyCourt position={[8, 0.01, 14]} />
      <ChessSet position={[3, 0, 8]} />

      {/* Projector mounted on the west wall of the zone (facing east) */}
      <WallProjector
        position={[0.5, 1.6, 8]}
        screenPos={[1.6, 1.6, 8]}
        screenSize={[3.2, 1.8]}
        videoSrc={"/media/movies.mp4"} // put a file at public/media/movies.mp4 or a GIF
      />
    </group>
  );
};

/* =========================
   Main Scene
========================= */

const GardenScene = (): React.ReactElement => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
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
              onClick={() => setShowLabels((v) => !v)}
              style={btnStyle}
              title="Show/Hide station labels"
            >
              {showLabels ? "Hide Labels" : "Show Labels"}
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
      onPointerMissed={() => setSelectedId(null)}
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
      <Paths mats={mats} />

      {/* garden lamps */}
      {isNight && (
        <>
          {/* warm glows */}
          <pointLight
            position={[-10, 1.2, 0]}
            intensity={11}
            distance={9}
            decay={2}
            color="#ffd9a1"
            castShadow
          />
          <pointLight
            position={[10, 1.2, 0]}
            intensity={11}
            distance={9}
            decay={2}
            color="#ffd9a1"
            castShadow
          />
          <pointLight
            position={[0, 1.2, -10]}
            intensity={11}
            distance={9}
            decay={2}
            color="#ffd9a1"
            castShadow
          />
          <pointLight
            position={[0, 1.2, 10]}
            intensity={11}
            distance={9}
            decay={2}
            color="#ffd9a1"
            castShadow
          />
        </>
      )}

      {/* Evenly distributed wall sconces on all walls */}
      <WallSconceRow wall="north" count={5} isNight={isNight} />
      <WallSconceRow wall="south" count={5} isNight={isNight} />
      <WallSconceRow wall="east" count={4} isNight={isNight} />
      <WallSconceRow wall="west" count={4} isNight={isNight} />

      {/* physical lamp meshes */}
      <GardenLamp position={[-10, 0, 0]} />
      <GardenLamp position={[10, 0, 0]} />
      <GardenLamp position={[0, 0, -10]} />
      <GardenLamp position={[0, 0, 10]} />

      <WallDoor position={[24.9, 1.1, 2]} rotation={[0, Math.PI / 2, 0]} />

      <HobbiesZone origin={[-24.9, 0.01, -24.9]} />

      {/* Stations */}
      {STATIONS.map((s) => (
        <Station
          key={s.id}
          id={s.id}
          position={s.pos}
          label={s.label}
          body={s.body}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          showLabels={showLabels}
        >
          {s.mesh({ mats })}
        </Station>
      ))}
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
