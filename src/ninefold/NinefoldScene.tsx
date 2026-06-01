import { Html, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { Station } from "./stations";
import { stations } from "./stations";

type MoveDir = "up" | "down" | "left" | "right";

type Props = {
  selected: Station | null;
  onSelect: (station: Station | null) => void;
  guided: boolean;
  moveDir: MoveDir | null;
};

function CameraRig({ focus, moveDir }: { focus: Station | null; moveDir: MoveDir | null }) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(11, 8, 11));
  const freeTarget = useRef(new THREE.Vector3(0, 0.6, 0));

  useFrame((_, dt) => {
    if (moveDir) {
      const speed = 8 * dt;
      if (moveDir === "up") freeTarget.current.z -= speed;
      if (moveDir === "down") freeTarget.current.z += speed;
      if (moveDir === "left") freeTarget.current.x -= speed;
      if (moveDir === "right") freeTarget.current.x += speed;
      freeTarget.current.x = THREE.MathUtils.clamp(freeTarget.current.x, -24, 24);
      freeTarget.current.z = THREE.MathUtils.clamp(freeTarget.current.z, -24, 24);
    }

    const target = focus
      ? new THREE.Vector3(...focus.position)
      : freeTarget.current;

    const desiredCamPos = target.clone().add(offset.current);
    camera.position.lerp(desiredCamPos, 1 - Math.exp(-2.4 * dt));
    camera.lookAt(target.x, target.y + 0.8, target.z);
  });

  return null;
}

function StationNode({ station, active, onClick }: { station: Station; active: boolean; onClick: () => void }) {
  const color = station.category === "places" ? "#baa17d" : station.category === "mind" ? "#8f9770" : "#7f8b73";
  return (
    <group position={station.position} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.6, 1.2, 16]} />
        <meshStandardMaterial color={active ? "#d9c8a9" : color} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.45, 0.2, 0.45]} />
        <meshStandardMaterial color="#f0eadf" roughness={1} />
      </mesh>
      <Html position={[0, 1.1, 0]} center distanceFactor={18}>
        <div className="node-label">{station.id}</div>
      </Html>
    </group>
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
        <cylinderGeometry args={[0.7, 0.95, 5.6, 20]} />
        <meshStandardMaterial color="#6f573d" roughness={1} />
      </mesh>
      <mesh position={[0, 6.7, 0]} castShadow>
        <sphereGeometry args={[3.4, 18, 18]} />
        <meshStandardMaterial color="#6f7e4d" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[12, 12.8, 96]} />
        <meshStandardMaterial color="#b7ab8b" roughness={1} />
      </mesh>

      <mesh position={[-14, 0.2, 12]}>
        <boxGeometry args={[5, 0.4, 3]} />
        <meshStandardMaterial color="#9c7a5b" roughness={0.95} />
      </mesh>
      <mesh position={[14, 0.04, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.1, 28]} />
        <meshStandardMaterial color="#79a8b8" roughness={0.5} metalness={0.1} />
      </mesh>
    </>
  );
}

export default function NinefoldScene({ selected, onSelect, guided, moveDir }: Props) {
  const [step, setStep] = useState(0);
  const ordered = useMemo(() => stations, []);
  const [freeFocus, setFreeFocus] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!guided) return;
    const id = window.setInterval(() => setStep((v) => (v + 1) % ordered.length), 3400);
    return () => window.clearInterval(id);
  }, [guided, ordered.length]);

  const focus = guided ? ordered[step % ordered.length] : selected;

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [18, 14, 22], fov: 45 }}>
      <color attach="background" args={["#d6ccb4"]} />
      <Sky sunPosition={[5, 2, 1]} turbidity={4} rayleigh={0.6} />
      <ambientLight intensity={0.45} />
      <directionalLight castShadow intensity={1.2} position={[12, 20, 6]} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />

      <Suspense fallback={null}>
        <Environment onGroundClick={(p) => { setFreeFocus(p); onSelect(null); }} />
      </Suspense>

      {stations.map((station) => (
        <StationNode key={station.id} station={station} active={focus?.id === station.id} onClick={() => onSelect(station)} />
      ))}

      <CameraRig focus={focus ?? (freeFocus ? { ...stations[0], position: [freeFocus.x, 0.6, freeFocus.z] } : null)} moveDir={guided ? null : moveDir} />
      <OrbitControls enabled={!guided} enablePan={false} minDistance={10} maxDistance={28} target={new THREE.Vector3(0, 1, 0)} />

      {guided && (
        <Html position={[0, 11, 0]} center>
          <div className="tour-chip">Guided Tour Active</div>
        </Html>
      )}
    </Canvas>
  );
}
