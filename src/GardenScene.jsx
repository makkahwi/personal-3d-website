import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useCursor,
  PointerLockControls,
} from "@react-three/drei";

/** ---------- Reusable Station ---------- */
function Station({
  id,
  position = [0, 0, 0],
  label = "Station",
  body = "Details",
  selectedId,
  setSelectedId,
  showLabels = true,
  children,
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // subtle hover bob/scale
  const groupRef = useRef();
  const baseY = position[1];
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const bob = hovered ? Math.sin(t * 3) * 0.07 : 0;
    groupRef.current.position.y = baseY + bob;
    const s = hovered ? 1.06 : 1.0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, s, 0.2)
    );
  });

  const isOpen = selectedId === id;

  return (
    <group position={position} ref={groupRef}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(isOpen ? null : id);
        }}
      >
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
}

/** ---------- Scene Content (data-driven) ---------- */
const STATIONS = [
  {
    id: "pond",
    pos: [-15, 0.5, 0],
    label: "Swimming / Walking",
    body: "I like swimming and long walks — quiet focus and movement. This pond anchors the active/peaceful side.",
    mesh: ({ mats }) => (
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <primitive object={mats.water} attach="material" />
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
        <primitive object={mats.red} attach="material" />
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
        <primitive object={mats.dark} attach="material" />
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
        <primitive object={mats.wood} attach="material" />
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
        <primitive object={mats.dark} attach="material" />
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
        <primitive object={mats.wall} attach="material" />
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
        <primitive object={mats.path} attach="material" />
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
        <primitive object={mats.path} attach="material" />
      </mesh>
    ),
  },
];

/** ---------- World Pieces ---------- */
function Ground({ mats }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <primitive object={mats.grass} attach="material" />
    </mesh>
  );
}

function Walls({ mats }) {
  const sides = ["north", "south", "east", "west"];
  const positions = {
    north: [0, 2.5, -25],
    south: [0, 2.5, 25],
    east: [25, 2.5, 0],
    west: [-25, 2.5, 0],
  };
  const rotations = {
    north: [0, 0, 0],
    south: [0, 0, 0],
    east: [0, Math.PI / 2, 0],
    west: [0, Math.PI / 2, 0],
  };

  return sides.map((side) => (
    <mesh
      key={side}
      position={positions[side]}
      rotation={rotations[side]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[50, 5, 1]} />
      <primitive object={mats.wall} attach="material" />
    </mesh>
  ));
}

function OliveTree({ mats }) {
  return (
    <>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <primitive object={mats.trunk} attach="material" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 24, 24]} />
        <primitive object={mats.leaves} attach="material" />
      </mesh>
    </>
  );
}

function Paths({ mats }) {
  const positions = [
    [-10, 0.01, 0],
    [10, 0.01, 0],
    [0, 0.01, -10],
    [0, 0.01, 10],
  ];
  return positions.map((pos, i) => (
    <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 4]} />
      <primitive object={mats.path} attach="material" />
    </mesh>
  ));
}

/** ---------- First-person Player ---------- */
function Player({ enabled, bounds = 24.2, speed = 5 }) {
  const { camera } = useThree();
  const keys = useRef({});

  // eye height
  useEffect(() => {
    if (enabled) {
      camera.position.set(0, 1.7, 18);
      camera.lookAt(0, 1.7, 0);
    }
  }, [enabled, camera]);

  useEffect(() => {
    const down = (e) => (keys.current[e.code] = true);
    const up = (e) => (keys.current[e.code] = false);
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

    // camera’s forward (xz only) & right
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

    // simple wall clamp so you can’t leave the courtyard
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

    // avoid tree trunk (simple circular exclusion at center radius ~2)
    const r = Math.hypot(camera.position.x, camera.position.z);
    const minR = 2.0;
    if (r < minR) {
      const scale = minR / (r || 0.0001);
      camera.position.x *= scale;
      camera.position.z *= scale;
    }
  });

  return enabled ? <PointerLockControls selector="#click-to-lock" /> : null;
}

/** ---------- Main ---------- */
export default function GardenScene() {
  const [selectedId, setSelectedId] = useState(null);
  const [isNight, setIsNight] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [walkMode, setWalkMode] = useState(false);

  const mats = useMemo(
    () => ({
      grass: new THREE.MeshStandardMaterial({ color: "#7c9c6e", roughness: 1 }),
      wall: new THREE.MeshStandardMaterial({
        color: "#c4b7a6",
        roughness: 0.9,
      }),
      trunk: new THREE.MeshStandardMaterial({ color: "#5a3e2b", roughness: 1 }),
      leaves: new THREE.MeshStandardMaterial({
        color: "#355e3b",
        roughness: 0.8,
      }),
      path: new THREE.MeshStandardMaterial({
        color: "#c2b280",
        roughness: 0.9,
      }),
      water: new THREE.MeshStandardMaterial({
        color: "#3a8fb7",
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      }),
      wood: new THREE.MeshStandardMaterial({
        color: "#8b5a2b",
        roughness: 0.9,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#333333",
        roughness: 0.7,
      }),
      red: new THREE.MeshStandardMaterial({ color: "#8b0000", roughness: 0.6 }),
    }),
    []
  );

  // HUD overlay
  function Hud() {
    const controlsRef = useRef();
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
            ref={controlsRef}
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
              padding: 10,
              display: "flex",
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
                bottom: -250,
                padding: 15,
                margin: 10,
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
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 12, 20], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
      onPointerMissed={() => setSelectedId(null)}
    >
      {/* Lighting */}
      <ambientLight intensity={isNight ? 0.15 : 0.4} />
      <hemisphereLight
        skyColor={isNight ? "#1e2742" : "#bcd3e6"}
        groundColor={isNight ? "#2a3a2f" : "#7c9c6e"}
        intensity={isNight ? 0.15 : 0.25}
      />
      <directionalLight
        position={[10, 15, 5]}
        intensity={isNight ? 0.5 : 1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color={isNight ? "#c2d0ff" : "#ffffff"}
      />

      {/* First-person controller (moves camera when enabled) */}
      <Player enabled={walkMode} />

      {/* World */}
      <Ground mats={mats} />
      <Walls mats={mats} />
      <OliveTree mats={mats} />
      <Paths mats={mats} />

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

      {/* HUD + (Orbit controls only when not walking) */}
      <Hud />
    </Canvas>
  );
}

/** tiny inline style helper */
const btnStyle = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "#fff",
  cursor: "pointer",
};
