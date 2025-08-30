import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function GardenScene() {
  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Ground (grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>

      {/* Walls */}
      {["north", "south", "east", "west"].map((side, i) => {
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
          >
            <boxGeometry args={[50, 5, 1]} />
            <meshStandardMaterial color="#d2b48c" /> {/* beige brick color */}
          </mesh>
        );
      })}

      {/* Center Olive Tree (placeholder) */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* Stone Paths */}
      {[
        [-10, 0, 0],
        [10, 0, 0],
        [0, 0, -10],
        [0, 0, 10],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 4]} />
          <meshStandardMaterial color="#c2b280" />
        </mesh>
      ))}

      {/* Station Placeholders */}
      {/* Swimming pond */}
      <mesh position={[-15, 0.5, 0]}>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial color="blue" opacity={0.7} transparent />
      </mesh>

      {/* Motorcycle corner */}
      <mesh position={[15, 0.5, 0]}>
        <boxGeometry args={[2, 2, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Chess pergola placeholder */}
      <mesh position={[0, 0.5, 15]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Cooking table */}
      <mesh position={[0, 0.5, -15]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="saddlebrown" />
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
