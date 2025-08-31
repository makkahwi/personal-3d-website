import { Html, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as React from "react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { RootState } from "@react-three/fiber";

type Vec3 = [number, number, number];

type CountryItem = {
  id: string;
  name: string;
  landmarkLabel: string;
  Icon: React.FC; // tiny abstract icon component
};

type Props = {
  position?: Vec3;
  radius?: number;
  isNight?: boolean;
};

const WorldFairCarousel: React.FC<Props> = ({
  position = [0, 0, 0],
  radius = 4.5,
  isNight,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // gentle rotation
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += dt * 0.15;
  });

  // --- Data: 11 countries + minimal landmark icons ---
  const countries: CountryItem[] = useMemo(
    () => [
      {
        id: "my",
        name: "Malaysia",
        landmarkLabel: "Petronas Towers",
        Icon: IconPetronas,
      },
      { id: "th", name: "Thailand", landmarkLabel: "Wat Spire", Icon: IconWat },
      {
        id: "lk",
        name: "Sri Lanka",
        landmarkLabel: "Sigiriya Rock",
        Icon: IconSigiriya,
      },
      { id: "in", name: "India", landmarkLabel: "Taj Dome", Icon: IconTaj },
      { id: "qa", name: "Qatar", landmarkLabel: "Dhow Sail", Icon: IconDhow },
      {
        id: "sa",
        name: "Saudi Arabia",
        landmarkLabel: "Palm Date",
        Icon: IconPalm,
      },
      {
        id: "jo",
        name: "Jordan",
        landmarkLabel: "Petra Facade",
        Icon: IconPetra,
      },
      {
        id: "sy",
        name: "Syria",
        landmarkLabel: "Citadel Arch",
        Icon: IconArch,
      },
      { id: "lb", name: "Lebanon", landmarkLabel: "Cedar", Icon: IconCedar },
      {
        id: "tr",
        name: "Turkey",
        landmarkLabel: "Dome+Minarets",
        Icon: IconDomeMinaret,
      },
      {
        id: "eg",
        name: "Egypt",
        landmarkLabel: "Pyramids",
        Icon: IconPyramids,
      },
    ],
    []
  );

  // --- Wheel geometry: rim + spokes + hub ---
  return (
    <group position={position}>
      {/* base plinth */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.4, 24]} />
        <meshStandardMaterial color="#6b6b75" roughness={0.9} />
      </mesh>

      {/* support legs */}
      <group position={[0, 0.2, 0]}>
        <SupportLeg x={-0.9} z={-0.6} />
        <SupportLeg x={0.9} z={-0.6} />
        <SupportLeg x={-0.9} z={0.6} />
        <SupportLeg x={0.9} z={0.6} />
      </group>

      {/* rotating group */}
      <group ref={groupRef} position={[0, 2.5, 0]}>
        {/* rim */}
        <mesh castShadow>
          <torusGeometry args={[radius, 0.06, 10, 64]} />
          <meshStandardMaterial
            color="#b7b7c5"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>

        {/* spokes */}
        {[...Array(11)].map((_, i) => {
          const a = (i / 11) * Math.PI * 2;
          return <Spoke key={i} angle={a} length={radius} />;
        })}

        {/* hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#9a9aa6" roughness={0.7} />
        </mesh>

        {/* cabins */}
        {countries.map((c, i) => {
          const a = (i / countries.length) * Math.PI * 2;
          const x = Math.cos(a) * radius;
          const z = Math.sin(a) * radius;
          return (
            <Cabin
              key={c.id}
              position={[x, -0.2, z]}
              angle={a}
              item={c}
              active={activeId === c.id}
              setActive={setActiveId}
              isNight={!!isNight}
            />
          );
        })}
      </group>
    </group>
  );
};

export default WorldFairCarousel;

/* ---------- Small pieces ---------- */

const SupportLeg: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <mesh position={[x, 0, z]} castShadow>
    <boxGeometry args={[0.18, 1.6, 0.18]} />
    <meshStandardMaterial color="#4b4b55" roughness={0.9} />
  </mesh>
);

const Spoke: React.FC<{ angle: number; length: number }> = ({
  angle,
  length,
}) => {
  const rotY = Math.atan2(Math.sin(angle), Math.cos(angle));
  const mid = new THREE.Vector3(
    Math.cos(angle) * (length / 2),
    0,
    Math.sin(angle) * (length / 2)
  );
  return (
    <mesh position={[mid.x, 0, mid.z]} rotation={[0, rotY, 0]} castShadow>
      <boxGeometry args={[length - 0.2, 0.04, 0.04]} />
      <meshStandardMaterial color="#b7b7c5" roughness={0.65} metalness={0.15} />
    </mesh>
  );
};

/* ---------- Cabin with tiny flag + landmark icon ---------- */

const Cabin: React.FC<{
  position: Vec3;
  angle: number;
  item: { id: string; name: string; landmarkLabel: string; Icon: React.FC };
  active: boolean;
  setActive: (id: string | null) => void;
  isNight: boolean;
}> = ({ position, angle, item, active, setActive, isNight }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // keep the cabin upright as the wheel rotates: rotate opposite the wheel's yaw
  const cabinRef = useRef<THREE.Group>(null);
  useFrame(() => {
    const cab = cabinRef.current;
    const parent = cab?.parent as THREE.Group | undefined;
    if (cab && parent) cab.rotation.y = -parent.rotation.y;
  });

  return (
    <group position={position} ref={cabinRef}>
      {/* hanger bar */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[0.04, 1.2, 0.04]} />
        <meshStandardMaterial color="#b7b7c5" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* gondola */}
      <group position={[0, -0.2, 0]}>
        <mesh
          castShadow
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
            setActive(active ? null : item.id);
          }}
          scale={hovered ? 1.06 : 1}
        >
          <boxGeometry args={[0.9, 0.5, 0.5]} />
          <meshStandardMaterial
            color={hovered ? "#ffcf66" : "#ffc94d"}
            roughness={0.6}
          />
        </mesh>

        {/* flag plates on all four sides */}
        <group position={[0, 0.2, 0]}>
          {/* front */}
          <FlagPlate
            id={item.id}
            rotation={[0, 0, 0]}
            position={[0, 0, 0.28]}
          />
          {/* back */}
          <FlagPlate
            id={item.id}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, -0.28]}
          />
          {/* left */}
          <FlagPlate
            id={item.id}
            rotation={[0, Math.PI / 2, 0]}
            position={[-0.28, 0, 0]}
          />
          {/* right */}
          <FlagPlate
            id={item.id}
            rotation={[0, -Math.PI / 2, 0]}
            position={[0.28, 0, 0]}
          />
        </group>

        {/* tiny landmark icon on roof */}
        <group position={[0, 0.4, 0]}>
          <item.Icon />
        </group>
      </group>

      {/* info popup */}
      {active && (
        <Html distanceFactor={12} position={[0, 0.9, 0]} transform>
          <div
            style={{
              maxWidth: 220,
              padding: "8px 10px",
              borderRadius: 10,
              background: "rgba(20,20,28,0.9)",
              color: "#fff",
              fontSize: 13,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
            <div style={{ opacity: 0.9 }}>{item.landmarkLabel}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <button
                onClick={() => setActive(null)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "#2b6cb0",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* glow at night to make cabins pop */}
      {isNight && (
        <pointLight
          position={[0, -0.1, 0]}
          intensity={0.4}
          distance={2.5}
          color="#ffd37a"
        />
      )}
    </group>
  );
};

/* ---------- Flag plate (very abstract colors; no textures needed) ---------- */

const FlagPlate: React.FC<{
  id: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ id, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const bands = getFlagBands(id);
  return (
    <group position={position} rotation={rotation}>
      {bands.map((c, i) => (
        <mesh key={i} position={[0, 0.1 - i * 0.1, 0]}>
          <planeGeometry args={[0.6, 0.09]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
    </group>
  );
};

const getFlagBands = (id: string): string[] => {
  switch (id) {
    case "my":
      return ["#c00", "#fff", "#c00"]; // (abstract)
    case "th":
      return ["#c00", "#fff", "#001a57"];
    case "lk":
      return ["#f90", "#060"];
    case "in":
      return ["#f60", "#fff", "#060"];
    case "qa":
      return ["#fff", "#8b004b"];
    case "sa":
      return ["#0a5", "#0a5", "#0a5"];
    case "jo":
      return ["#000", "#fff", "#0a5"];
    case "sy":
      return ["#000", "#fff", "#c00"];
    case "lb":
      return ["#c00", "#fff", "#c00"];
    case "tr":
      return ["#c00", "#c00", "#c00"];
    case "eg":
      return ["#000", "#fff", "#c00"];
    default:
      return ["#999", "#ddd", "#999"];
  }
};

/* ---------- Tiny abstract landmarks (low-poly, no assets) ---------- */

const IconPetronas: React.FC = () => (
  <group>
    <mesh position={[-0.18, 0.3, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.14, 0.6, 8]} />
      <meshStandardMaterial color="#cfd8e6" metalness={0.4} roughness={0.4} />
    </mesh>
    <mesh position={[0.18, 0.3, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.14, 0.6, 8]} />
      <meshStandardMaterial color="#cfd8e6" metalness={0.4} roughness={0.4} />
    </mesh>
    {/* skybridge */}
    <mesh position={[0, 0.22, 0]} castShadow>
      <boxGeometry args={[0.36, 0.06, 0.06]} />
      <meshStandardMaterial color="#d7e0ee" metalness={0.4} roughness={0.3} />
    </mesh>
  </group>
);

const IconWat: React.FC = () => (
  <mesh castShadow>
    <coneGeometry args={[0.18, 0.5, 6]} />
    <meshStandardMaterial color="#d7b36a" roughness={0.6} />
  </mesh>
);

const IconSigiriya: React.FC = () => (
  <mesh castShadow>
    <dodecahedronGeometry args={[0.22, 0]} />
    <meshStandardMaterial color="#8a6f55" roughness={0.8} />
  </mesh>
);

const IconTaj: React.FC = () => (
  <group>
    <mesh castShadow>
      <sphereGeometry args={[0.16, 12, 12]} />
      <meshStandardMaterial color="#ededf0" roughness={0.6} />
    </mesh>
    <mesh castShadow position={[0, -0.14, 0]}>
      <boxGeometry args={[0.36, 0.08, 0.36]} />
      <meshStandardMaterial color="#e7e7ea" roughness={0.8} />
    </mesh>
  </group>
);

const IconDhow: React.FC = () => (
  <group>
    <mesh castShadow position={[0, -0.05, 0]}>
      <boxGeometry args={[0.32, 0.06, 0.12]} />
      <meshStandardMaterial color="#8b5e3c" roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0.06, 0.1, 0]}>
      <planeGeometry args={[0.22, 0.22]} />
      <meshStandardMaterial color="#f5f3e9" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

const IconPalm: React.FC = () => (
  <group>
    <mesh castShadow>
      <cylinderGeometry args={[0.03, 0.05, 0.45, 6]} />
      <meshStandardMaterial color="#7a523b" roughness={0.9} />
    </mesh>
    {[...Array(5)].map((_, i) => (
      <mesh
        key={i}
        position={[0, 0.28, 0]}
        rotation={[0, (i / 5) * Math.PI * 2, -0.8]}
      >
        <boxGeometry args={[0.28, 0.04, 0.06]} />
        <meshStandardMaterial color="#2f7d47" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

const IconPetra: React.FC = () => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[0.36, 0.22, 0.12]} />
      <meshStandardMaterial color="#c97b5a" roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0, 0.17, 0]}>
      <boxGeometry args={[0.3, 0.1, 0.1]} />
      <meshStandardMaterial color="#d7916f" roughness={0.9} />
    </mesh>
  </group>
);

const IconArch: React.FC = () => (
  <group>
    <mesh castShadow>
      <torusGeometry args={[0.18, 0.06, 12, 24, Math.PI]} />
      <meshStandardMaterial color="#b7a796" roughness={0.85} />
    </mesh>
  </group>
);

const IconCedar: React.FC = () => (
  <group>
    <mesh castShadow position={[0, -0.05, 0]}>
      <boxGeometry args={[0.06, 0.1, 0.06]} />
      <meshStandardMaterial color="#7a523b" roughness={0.9} />
    </mesh>
    {[0.2, 0.16, 0.12].map((w, i) => (
      <mesh key={i} position={[0, 0.05 + i * 0.08, 0]}>
        <boxGeometry args={[w, 0.04, w]} />
        <meshStandardMaterial color="#2f6d3f" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

const IconDomeMinaret: React.FC = () => (
  <group>
    <mesh castShadow>
      <sphereGeometry args={[0.16, 12, 12]} />
      <meshStandardMaterial color="#d8c9a6" roughness={0.7} />
    </mesh>
    <mesh castShadow position={[0.22, 0.05, 0]}>
      <cylinderGeometry args={[0.04, 0.05, 0.38, 8]} />
      <meshStandardMaterial color="#d8c9a6" roughness={0.7} />
    </mesh>
  </group>
);

const IconPyramids: React.FC = () => (
  <group>
    <mesh castShadow position={[-0.12, 0, 0]}>
      <coneGeometry args={[0.18, 0.24, 4]} />
      <meshStandardMaterial color="#d7b36a" roughness={0.8} />
    </mesh>
    <mesh castShadow position={[0.14, 0, 0]}>
      <coneGeometry args={[0.16, 0.2, 4]} />
      <meshStandardMaterial color="#d7b36a" roughness={0.8} />
    </mesh>
  </group>
);
