import * as React from "react";
import * as THREE from "three";

const FencePost: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => (
  <mesh position={position} castShadow>
    <boxGeometry args={[0.12, 1.2, 0.12]} />
    <meshStandardMaterial color="#6a533f" roughness={0.9} />
  </mesh>
);

const FenceRail: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
}> = ({ from, to }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const rotY = Math.atan2(dir.x, dir.z);
  return (
    <mesh position={[mid.x, mid.y, mid.z]} rotation={[0, rotY, 0]} castShadow>
      <boxGeometry args={[len, 0.08, 0.08]} />
      <meshStandardMaterial color="#7a5e46" roughness={0.9} />
    </mesh>
  );
};

const WoodFence: React.FC<{
  origin: [number, number, number];
  size: [number, number];
  gap?: number;
}> = ({ origin, size, gap = 2.4 }) => {
  const [w, h] = size;
  const [ox, oy, oz] = origin; // bottom-left of the fence area
  const posts: React.ReactElement[] = [];

  // perimeter posts
  for (let x = 0; x <= w; x += gap) {
    posts.push(<FencePost key={`n-${x}`} position={[ox + x, oy, oz + h]} />);
  }
  for (let z = 0; z <= h; z += gap) {
    posts.push(<FencePost key={`e-${z}`} position={[ox + w, oy, oz + z]} />);
  }

  const factor = 10;

  // rails (two per side)
  return (
    <group>
      {posts}
      {/* north rail */}
      <FenceRail
        from={[ox + factor, oy + 0.6, oz + h - factor]}
        to={[ox + w + factor, oy + 0.6, oz + h - factor]}
      />
      {/* east rail */}
      <FenceRail
        from={[ox + w - factor, oy + 0.6, oz + factor]}
        to={[ox + w - factor, oy + 0.6, oz + h + factor]}
      />
    </group>
  );
};

export default WoodFence;
