import type { Materials, Vec3 } from "../types";

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

export default Walls;
