import { Html, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as React from "react";
import { useRef } from "react";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import BottomBar from "../views/BottomBar";

const SceneControl = ({
  walkMode,
  setWalkMode,
  isNight,
  setIsNight,
}: {
  walkMode: boolean;
  setWalkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isNight: boolean;
  setIsNight: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const resetCamera = () => {
    setWalkMode(false);
    camera.position.set(0, 12, 20);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.target.set(0, 0, 0);
    controlsRef.current?.update();
  };
  return (
    <>
      {!walkMode && (
        <OrbitControls
          ref={controlsRef as React.MutableRefObject<OrbitControlsImpl>}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={40}
          enableDamping
          dampingFactor={0.06}
        />
      )}

      <Html fullscreen>
        <BottomBar
          walkMode={walkMode}
          setWalkMode={setWalkMode}
          isNight={isNight}
          setIsNight={setIsNight}
          onReset={resetCamera}
        />
      </Html>
    </>
  );
};

export default SceneControl;
