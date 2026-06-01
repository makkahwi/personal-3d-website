import { Html, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Station } from "../types/station";

type MoveDir = "up" | "down" | "left" | "right";

type Props = {
  stations: Station[];
  selected: Station | null;
  onSelect: (station: Station | null) => void;
  guided: boolean;
  moveDir: MoveDir | null;
};

function GuidedCamera({ focus }: { focus: Station | null }) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(11, 8, 11));

  useFrame((_, dt) => {
    if (!focus) return;
    const target = new THREE.Vector3(...focus.position);
    const desired = target.clone().add(offset.current);
    camera.position.lerp(desired, 1 - Math.exp(-2.4 * dt));
    camera.lookAt(target.x, target.y + 0.8, target.z);
  });

  return null;
}

function HobbyElements() {
  return (
    <>
      <group position={[-4.2, 0, 1.8]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[2.8, 0.14, 1.6]} />
          <meshStandardMaterial color="#9a7b59" />
        </mesh>
        <mesh position={[-1.2, 0.32, -0.65]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.64, 10]} /><meshStandardMaterial color="#6f573d" /></mesh>
        <mesh position={[1.2, 0.32, -0.65]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.64, 10]} /><meshStandardMaterial color="#6f573d" /></mesh>
        <mesh position={[-1.2, 0.32, 0.65]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.64, 10]} /><meshStandardMaterial color="#6f573d" /></mesh>
        <mesh position={[1.2, 0.32, 0.65]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.64, 10]} /><meshStandardMaterial color="#6f573d" /></mesh>

        <mesh position={[-0.8, 0.78, -0.15]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.22, 16]} />
          <meshStandardMaterial color="#4d4f52" metalness={0.2} roughness={0.65} />
        </mesh>
        <mesh position={[-0.8, 0.66, -0.15]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
          <meshStandardMaterial color="#2f3338" roughness={0.8} />
        </mesh>
        <mesh position={[-0.8, 0.58, -0.15]} castShadow>
          <boxGeometry args={[0.5, 0.12, 0.5]} />
          <meshStandardMaterial color="#181c1f" roughness={0.9} />
        </mesh>

        <mesh position={[0.75, 0.74, 0.2]} castShadow>
          <boxGeometry args={[0.62, 0.05, 0.62]} />
          <meshStandardMaterial color="#d8cfb8" />
        </mesh>
        <mesh position={[0.75, 0.77, 0.2]} castShadow>
          <boxGeometry args={[0.64, 0.01, 0.64]} />
          <meshStandardMaterial color="#3f3429" />
        </mesh>
      </group>

      <group position={[4.8, 0, 2.4]} rotation={[0, -0.6, 0]}>
        <mesh position={[-0.7, 0.42, 0]} castShadow><torusGeometry args={[0.38, 0.09, 10, 20]} /><meshStandardMaterial color="#1c1f22" /></mesh>
        <mesh position={[0.7, 0.42, 0]} castShadow><torusGeometry args={[0.38, 0.09, 10, 20]} /><meshStandardMaterial color="#1c1f22" /></mesh>
        <mesh position={[0, 0.68, 0]} castShadow><boxGeometry args={[1.6, 0.14, 0.18]} /><meshStandardMaterial color="#323a40" /></mesh>
        <mesh position={[0.2, 0.86, 0]} castShadow><boxGeometry args={[0.7, 0.18, 0.26]} /><meshStandardMaterial color="#5f3f32" /></mesh>
      </group>

      <mesh position={[2.6, 0.28, -3.2]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#e9d16b" />
      </mesh>


      <group position={[0, 0, -4.6]}>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#8ea3a8" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.35, 1.35]} />
          <meshStandardMaterial color="#77a9b8" roughness={0.35} metalness={0.08} />
        </mesh>
      </group>

      <Html position={[0, 1.6, 3.2]} center>
        <div className="feature-label">Hobbies: Cooking · Chess · Motorcycling · Volleyball</div>
      </Html>
    </>
  );
}

function Environment({ onGroundClick }: { onGroundClick: (p: THREE.Vector3) => void }) {
  const clickGround = (e: ThreeEvent<MouseEvent>) => onGroundClick(e.point);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={clickGround}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#c7ba9a" roughness={1} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.95, 5.8, 18]} />
        <meshStandardMaterial color="#6f573d" roughness={1} />
      </mesh>
      <mesh position={[0, 6.9, 0]} castShadow>
        <sphereGeometry args={[3.6, 18, 18]} />
        <meshStandardMaterial color="#6f7e4d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[12, 12.8, 96]} />
        <meshStandardMaterial color="#b7ab8b" roughness={1} />
      </mesh>
      <HobbyElements />
    </>
  );
}

export default function NinefoldScene({ stations, selected, onSelect, guided }: Props) {
  const [step, setStep] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ordered = useMemo(() => stations, [stations]);

  useEffect(() => {
    if (!guided || !ordered.length) return;
    const id = window.setInterval(() => setStep((v) => (v + 1) % ordered.length), 3400);
    return () => window.clearInterval(id);
  }, [guided, ordered.length]);

  const focus = guided ? ordered[step % (ordered.length || 1)] : selected;

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [18, 14, 22], fov: 45 }}>
      <color attach="background" args={["#d6ccb4"]} />
      <Sky sunPosition={[5, 2, 1]} turbidity={4} rayleigh={0.6} />
      <ambientLight intensity={0.45} />
      <directionalLight castShadow intensity={1.2} position={[12, 20, 6]} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Suspense fallback={null}><Environment onGroundClick={() => onSelect(null)} /></Suspense>

      {ordered.map((station) => {
        const active = focus?.id === station.id || hoveredId === station.id;
        return (
          <group
            key={station.id}
            position={station.position}
            onPointerEnter={() => setHoveredId(station.id)}
            onPointerLeave={() => setHoveredId((curr) => (curr === station.id ? null : curr))}
            onClick={() => onSelect(station)}
          >
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.6, 1.2, 16]} />
              <meshStandardMaterial color={active ? "#d9c8a9" : station.category === "places" ? "#baa17d" : station.category === "mind" ? "#8f9770" : "#7f8b73"} roughness={0.9} />
            </mesh>
            <Html position={[0, 1.2, 0]} center distanceFactor={16}>
              <div className="node-label">{station.title}</div>
            </Html>
          </group>
        );
      })}

      {(guided || selected) && <GuidedCamera focus={focus ?? null} />}
      <OrbitControls enabled={!guided} makeDefault enablePan minDistance={10} maxDistance={28} target={new THREE.Vector3(0, 1, 0)} />
      {guided && <Html position={[0, 11, 0]} center><div className="tour-chip">Guided Tour Active</div></Html>}
    </Canvas>
  );
}
