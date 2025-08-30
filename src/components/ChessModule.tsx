import * as React from "react";
import * as THREE from "three";

const useCheckerTexture = (size: number = 512, squares = 8) => {
  return React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const s = size / squares;

    for (let y = 0; y < squares; y++) {
      for (let x = 0; x < squares; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#f0f0f0" : "#2a2a2a";
        ctx.fillRect(x * s, y * s, s, s);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 8;
    return tex;
  }, [size, squares]);
};

/** Small sub-module: chess area */
const ChessModule: React.FC<{ offset?: [number, number, number] }> = ({
  offset = [0, 0.46, 0],
}) => {
  const checker = useCheckerTexture(512, 8);
  return (
    <group position={offset}>
      {/* board */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
        <meshStandardMaterial map={checker} roughness={0.85} />
      </mesh>
      {/* simple clock */}
      <mesh castShadow position={[0, 0.18, -0.55]}>
        <boxGeometry args={[0.24, 0.16, 0.12]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default ChessModule;
