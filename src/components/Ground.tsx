import type { Materials } from "../types";

const Ground = ({ mats }: { mats: Materials }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial {...mats.grass} />
    </mesh>
  );
};

export default Ground;
