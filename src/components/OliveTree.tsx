import type { Materials } from "../types";

const OliveTree = ({ mats }: { mats: Materials }) => {
  return (
    <>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
        <meshStandardMaterial {...mats.trunk} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 24, 24]} />
        <meshStandardMaterial {...mats.leaves} />
      </mesh>
    </>
  );
};

export default OliveTree;
