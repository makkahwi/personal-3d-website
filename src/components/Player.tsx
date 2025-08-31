import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Player = ({
  enabled,
  bounds = 24.2,
  speed = 5,
}: {
  enabled: boolean;
  bounds?: number;
  speed?: number;
}) => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const plcRef = useRef<any>(null);

  useEffect(() => {
    if (enabled) {
      camera.position.set(0, 1.7, 18);
      camera.lookAt(0, 1.7, 0);
    }
  }, [enabled, camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    if (!enabled) return;

    const dir = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

    if (keys.current["KeyW"]) dir.add(forward);
    if (keys.current["KeyS"]) dir.sub(forward);
    if (keys.current["KeyA"]) dir.sub(right);
    if (keys.current["KeyD"]) dir.add(right);

    if (dir.lengthSq() > 0) {
      dir.normalize();
      camera.position.addScaledVector(dir, speed * dt);
    }

    // keep within walls
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -bounds,
      bounds
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -bounds,
      bounds
    );

    // avoid center trunk (simple radial push)
    const r = Math.hypot(camera.position.x, camera.position.z);
    const minR = 2.0;
    if (r < minR) {
      const scale = minR / (r || 0.0001);
      camera.position.x *= scale;
      camera.position.z *= scale;
    }
  });

  return enabled ? <PointerLockControls ref={plcRef} /> : null;
};

export default Player;
