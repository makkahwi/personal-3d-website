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
