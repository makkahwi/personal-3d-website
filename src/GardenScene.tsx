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
   Reusable Station
========================= */

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
