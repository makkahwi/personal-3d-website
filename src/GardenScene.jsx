import * as THREE from "three";
import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useCursor } from "@react-three/drei";

/** Reusable interactive station */
function Station({
  id,
  position = [0, 0, 0],
  label = "Station",
  body = "Details about this station.",
  selectedId,
  setSelectedId,
  children, // the mesh (geometry) you provide
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const isOpen = selectedId === id;

  return (
    <group position={position}>
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
        scale={hovered ? 1.06 : 1}
      >
        {children}
      </group>

      {/* Floating label (always visible, small) */}
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

      {/* Info card (only when selected) */}
      {isOpen && (
        <Html distanceFactor={10} position={[0, 3.2, 0]} transform>
          <div
            style={{
              maxWidth: 260,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.95)",
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

export default function GardenScene() {
  const [selectedId, setSelectedId] = useState(null);

  // simple memoed materials (tiny perf nicety)
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

  return (
    <Canvas
      shadows
      camera={{ position: [0, 12, 20], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
      onPointerMissed={() => setSelectedId(null)}
    >
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <primitive object={mats.grass} attach="material" />
      </mesh>

      {/* Walls */}
      {["north", "south", "east", "west"].map((side) => {
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
        return (
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
        );
      })}

      {/* Olive Tree */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <primitive object={mats.trunk} attach="material" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 24, 24]} />
        <primitive object={mats.leaves} attach="material" />
      </mesh>

      {/* Stone Paths */}
      {[
        [-10, 0.01, 0],
        [10, 0.01, 0],
        [0, 0.01, -10],
        [0, 0.01, 10],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[8, 4]} />
          <primitive object={mats.path} attach="material" />
        </mesh>
      ))}

      {/* Stations (interactive) */}
      <Station
        id="pond"
        position={[-15, 0.5, 0]}
        label="Swimming / Walking"
        body="I like swimming and long walks. This pond marks the active/quiet side of the garden."
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[4, 4, 1, 32]} />
          <primitive object={mats.water} attach="material" />
        </mesh>
      </Station>

      <Station
        id="moto"
        position={[15, 1, 0]}
        label="Travel & Motorcycling"
        body="I enjoy traveling and motorcycling—adventure, open roads, and discovering new places."
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 2, 4]} />
          <primitive object={mats.red} attach="material" />
        </mesh>
      </Station>

      <Station
        id="chess"
        position={[0, 0.5, 15]}
        label="Chess & Strategy"
        body="I like chess and strategic thinking—fits my interest in problem solving and mindful play."
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1, 4]} />
          <primitive object={mats.dark} attach="material" />
        </mesh>
      </Station>

      <Station
        id="cooking"
        position={[0, 0.5, -15]}
        label="Cooking & Dishes"
        body="Asian, Western, and Middle Eastern dishes (Persian, Arabic, Turkish) — food is culture!"
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1, 2]} />
          <primitive object={mats.wood} attach="material" />
        </mesh>
      </Station>

      {/* Controls */}
      <OrbitControls
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={40}
      />
    </Canvas>
  );
}
