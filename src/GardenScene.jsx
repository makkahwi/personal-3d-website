import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function GardenScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 12, 20], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
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

      {/* Ground (grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#7c9c6e" roughness={1} />
      </mesh>

      {/* Courtyard Walls */}
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
            <meshStandardMaterial color="#c4b7a6" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Olive Tree (placeholder) */}
      {/* Trunk */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <meshStandardMaterial color="#5a3e2b" roughness={1} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 24, 24]} />
        <meshStandardMaterial color="#355e3b" roughness={0.8} />
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
          <meshStandardMaterial color="#c2b280" roughness={0.9} />
        </mesh>
      ))}

      {/* Stations (placeholders) */}

      {/* Swimming Pond */}
      <mesh position={[-15, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial
          color="#3a8fb7"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Motorcycle Corner */}
      <mesh position={[15, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 4]} />
        <meshStandardMaterial color="#8b0000" roughness={0.6} />
      </mesh>

      {/* Chess Pergola Placeholder */}
      <mesh position={[0, 0.5, 15]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* Cooking Table */}
      <mesh position={[0, 0.5, -15]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={40}
      />
    </Canvas>
  );
}
