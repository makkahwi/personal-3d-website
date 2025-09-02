import { Html, useCursor } from "@react-three/drei";
import * as React from "react";
import * as THREE from "three";

export type Vec3 = [number, number, number];

type Item = {
  id: string;
  name: string;
  flag: string; // emoji for now (swap to textures later if you like)
  builder: () => React.ReactNode; // miniature shape
};

// -- Miniature landmark builders (stylized primitives) --
const TwinTowers = () => (
  <group>
    <mesh position={[-0.25, 0.9, 0]} castShadow>
      <boxGeometry args={[0.22, 1.8, 0.22]} />
      <meshStandardMaterial color="#c9d3da" metalness={0.3} roughness={0.4} />
    </mesh>
    <mesh position={[0.25, 0.9, 0]} castShadow>
      <boxGeometry args={[0.22, 1.8, 0.22]} />
      <meshStandardMaterial color="#c9d3da" metalness={0.3} roughness={0.4} />
    </mesh>
    <mesh position={[-0.25, 1.95, 0]}>
      <coneGeometry args={[0.07, 0.14, 8]} />
      <meshStandardMaterial color="#dfe6ea" />
    </mesh>
    <mesh position={[0.25, 1.95, 0]}>
      <coneGeometry args={[0.07, 0.14, 8]} />
      <meshStandardMaterial color="#dfe6ea" />
    </mesh>
  </group>
);

const TempleChedi = () => (
  <group>
    <mesh position={[0, 0.22, 0]}>
      <cylinderGeometry args={[0.28, 0.34, 0.18, 16]} />
      <meshStandardMaterial color="#dcb46a" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.55, 0]}>
      <coneGeometry args={[0.22, 0.6, 12]} />
      <meshStandardMaterial color="#e7c784" />
    </mesh>
    <mesh position={[0, 0.92, 0]}>
      <coneGeometry args={[0.06, 0.25, 12]} />
      <meshStandardMaterial color="#f0d9a3" />
    </mesh>
  </group>
);

const Stupa = () => (
  <group>
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.32, 0.36, 0.14, 24]} />
      <meshStandardMaterial color="#ece7d6" />
    </mesh>
    <mesh position={[0, 0.45, 0]}>
      <sphereGeometry args={[0.28, 24, 16]} />
      <meshStandardMaterial color="#f7f3e6" />
    </mesh>
    <mesh position={[0, 0.85, 0]}>
      <coneGeometry args={[0.06, 0.3, 10]} />
      <meshStandardMaterial color="#e5dfc9" />
    </mesh>
  </group>
);

const TajDome = () => (
  <group>
    <mesh position={[0, 0.22, 0]}>
      <boxGeometry args={[0.6, 0.16, 0.6]} />
      <meshStandardMaterial color="#f2efe9" />
    </mesh>
    <mesh position={[0, 0.55, 0]}>
      <sphereGeometry args={[0.28, 24, 16]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0.86, 0]}>
      <coneGeometry args={[0.06, 0.18, 10]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </group>
);

const DohaCubes = () => (
  <group>
    <mesh position={[0, 0.21, 0]}>
      <boxGeometry args={[0.5, 0.14, 0.5]} />
      <meshStandardMaterial color="#ddd5c7" />
    </mesh>
    <mesh position={[0, 0.46, 0]}>
      <boxGeometry args={[0.4, 0.3, 0.4]} />
      <meshStandardMaterial color="#f1eadb" />
    </mesh>
  </group>
);

const PalmAndTower = () => (
  <group>
    <mesh position={[0.22, 0.7, 0]}>
      <cylinderGeometry args={[0.05, 0.07, 1.2, 10]} />
      <meshStandardMaterial color="#8a6a3f" />
    </mesh>
    {[...Array(6)].map((_, i) => (
      <mesh
        key={i}
        position={[0.22, 1.25, 0]}
        rotation={[0.4, (i * Math.PI) / 3, 0]}
      >
        <boxGeometry args={[0.02, 0.25, 0.1]} />
        <meshStandardMaterial color="#2f5e3b" />
      </mesh>
    ))}
    <mesh position={[-0.25, 0.9, 0]}>
      <boxGeometry args={[0.18, 1.8, 0.18]} />
      <meshStandardMaterial color="#c9d3da" metalness={0.3} roughness={0.4} />
    </mesh>
  </group>
);

const PetraFacade = () => (
  <group>
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[0.7, 0.7, 0.14]} />
      <meshStandardMaterial color="#c97a52" />
    </mesh>
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
      <meshStandardMaterial color="#d4875c" />
    </mesh>
    <mesh position={[0, 1.02, 0]}>
      <sphereGeometry args={[0.12, 16, 12]} />
      <meshStandardMaterial color="#e09973" />
    </mesh>
  </group>
);

const CitadelArch = () => (
  <group>
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[0.7, 0.5, 0.14]} />
      <meshStandardMaterial color="#b99f84" />
    </mesh>
    <mesh position={[0, 0.62, 0]}>
      <torusGeometry args={[0.25, 0.06, 12, 24, Math.PI]} />
      <meshStandardMaterial color="#cbb59b" />
    </mesh>
  </group>
);

const RaoucheRocks = () => (
  <group>
    <mesh position={[-0.18, 0.25, 0]}>
      <dodecahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial color="#9b7b5e" roughness={1} />
    </mesh>
    <mesh position={[0.24, 0.21, 0]}>
      <dodecahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#8a6a4e" roughness={1} />
    </mesh>
  </group>
);

const HagiaSophia = () => (
  <group>
    <mesh position={[0, 0.22, 0]}>
      <boxGeometry args={[0.7, 0.16, 0.7]} />
      <meshStandardMaterial color="#d8a07f" />
    </mesh>
    <mesh position={[0, 0.55, 0]}>
      <sphereGeometry args={[0.32, 24, 16]} />
      <meshStandardMaterial color="#f0d3b6" />
    </mesh>
    {/* 2 tiny minarets */}
    {[-0.34, 0.34].map((x, i) => (
      <group key={i} position={[x, 0.65, 0.34 * (i ? -1 : 1)]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.04, 0.6, 10]} />
          <meshStandardMaterial color="#d8c6b5" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.05, 0.18, 10]} />
          <meshStandardMaterial color="#efe4d7" />
        </mesh>
      </group>
    ))}
  </group>
);

const PyramidAndObelisk = () => (
  <group>
    <mesh position={[0, 0.28, 0]}>
      <coneGeometry args={[0.5, 0.9, 4]} />
      <meshStandardMaterial color="#e0c181" />
    </mesh>
    <mesh position={[0.42, 0.48, 0]}>
      <boxGeometry args={[0.08, 0.96, 0.08]} />
      <meshStandardMaterial color="#d7bb76" />
    </mesh>
  </group>
);

// -- Data: 11 nations, each with a miniature builder --
const ITEMS: Item[] = [
  { id: "my", name: "Malaysia", flag: "🇲🇾", builder: TwinTowers },
  { id: "th", name: "Thailand", flag: "🇹🇭", builder: TempleChedi },
  { id: "lk", name: "Sri Lanka", flag: "🇱🇰", builder: Stupa },
  { id: "in", name: "India", flag: "🇮🇳", builder: TajDome },
  { id: "qa", name: "Qatar", flag: "🇶🇦", builder: DohaCubes },
  { id: "sa", name: "Saudi Arabia", flag: "🇸🇦", builder: PalmAndTower },
  { id: "jo", name: "Jordan", flag: "🇯🇴", builder: PetraFacade },
  { id: "sy", name: "Syria", flag: "🇸🇾", builder: CitadelArch },
  { id: "lb", name: "Lebanon", flag: "🇱🇧", builder: RaoucheRocks },
  { id: "tr", name: "Turkey", flag: "🇹🇷", builder: HagiaSophia },
  { id: "eg", name: "Egypt", flag: "🇪🇬", builder: PyramidAndObelisk },
];

const Pedestal: React.FC = () => (
  <group>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.45, 0.5, 0.22, 24]} />
      <meshStandardMaterial color="#d6d2c9" roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.14, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.04, 24]} />
      <meshStandardMaterial color="#c3bdb1" roughness={0.9} />
    </mesh>
  </group>
);

const MiniSpot: React.FC<{
  item: Item;
  pos: Vec3;
  selected: string | null;
  setSelected: (id: string | null) => void;
}> = ({ item, pos, selected }) => {
  const group = React.useRef<THREE.Group>(null);
  const [hover, setHover] = React.useState(false);
  useCursor(hover);

  // gentle hover pulse
  React.useEffect(() => {
    if (group.current) group.current.scale.setScalar(1);
  }, []);
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (group.current) {
        const current = group.current.scale.x;
        const target = hover ? 1.06 : 1;
        const next = THREE.MathUtils.lerp(current, target, 0.15);
        group.current.scale.setScalar(next);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [hover]);

  const isOpen = selected === item.id;

  return (
    <group
      ref={group}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHover(false);
      }}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   setSelected(isOpen ? null : item.id);
      // }}
    >
      <Pedestal />
      <group position={[0, 0.24, 0]}>{item.builder()}</group>

      {/* flag label */}
      <Html distanceFactor={3} position={[0, 0, 0]} transform>
        <div style={flagBadge}>{item.name}</div>
      </Html>

      {/* popup */}
      {isOpen && (
        <Html distanceFactor={14} position={[0, 1.3, 0]} transform>
          <div style={card} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {item.flag} {item.name}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              Miniature landmark. Click anywhere to close. (We can add a
              story/photo later.)
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const MiniaturePark: React.FC<{ position: Vec3; radius?: number }> = ({
  position,
  radius = 7.5,
}) => {
  const [selected, setSelected] = React.useState<string | null>(null);

  // Arrange 11 spots in a circle
  const positions = React.useMemo<Vec3[]>(() => {
    const arr: Vec3[] = [];
    for (let i = 0; i < ITEMS.length; i++) {
      const a = (i / ITEMS.length) * Math.PI * 2;
      arr.push([Math.cos(a) * radius, 0.01, Math.sin(a) * radius]);
    }
    return arr;
  }, [radius]);

  return (
    <group position={position}>
      {/* park ring base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[radius + 1.5, radius + 2.5, 64]} />
        <meshStandardMaterial color="#cbb79a" roughness={1} />
      </mesh>

      {ITEMS.map((it, i) => (
        <MiniSpot
          key={it.id}
          item={it}
          pos={positions[i]}
          selected={selected}
          setSelected={setSelected}
        />
      ))}

      {/* title stone
      <group position={[0, 0, radius + 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.18, 0.8]} />
          <meshStandardMaterial color="#d6d2c9" />
        </mesh>
        <Html distanceFactor={14} position={[0, 0.3, 0]} transform>
          <div style={title}>Miniatürk — 11 Nations</div>
        </Html>
      </group> */}
    </group>
  );
};

export default MiniaturePark;

/* ---------- UI styles ---------- */
const flagBadge: React.CSSProperties = {
  fontSize: 18,
  padding: "4px 6px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(0,0,0,0.12)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const card: React.CSSProperties = {
  maxWidth: 220,
  padding: 10,
  borderRadius: 12,
  background: "rgba(255,255,255,0.98)",
  color: "#222",
  boxShadow: "0 12px 24px rgba(0,0,0,0.28)",
};

// const title: React.CSSProperties = {
//   padding: "6px 10px",
//   borderRadius: 10,
//   background: "rgba(0,0,0,0.55)",
//   color: "#fff",
//   fontSize: 14,
//   letterSpacing: 0.4,
//   boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
// };
