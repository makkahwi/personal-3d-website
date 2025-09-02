import * as React from "react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const WallProjector: React.FC<{
  screenPos: [number, number, number];
  screenSize?: [number, number];
  videoSrc: string;
  screenRotation?: [number, number, number]; // NEW
}> = ({
  screenPos,
  screenSize = [3, 1.7],
  videoSrc,
  screenRotation = [0, 0, 0],
}) => {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = videoSrc;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    return v;
  }, [videoSrc]);

  useEffect(() => {
    // Autoplay (user gesture may be required in some browsers; clicking page will start it)
    video.play().catch(() => {});
  }, [video]);

  const texture = useMemo(() => new THREE.VideoTexture(video), [video]);

  return (
    <group>
      <mesh castShadow position={[2, 1, -8]}>
        <boxGeometry args={[0.4, 0.25, 0.25]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      {/* mount on wall */}
      <mesh position={screenPos} rotation={screenRotation}>
        <planeGeometry args={screenSize} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default WallProjector;
