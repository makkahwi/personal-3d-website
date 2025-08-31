import { Html, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as React from "react";
import { useRef } from "react";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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
    camera.position.set(200, 120, 200);
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
        <div
          style={{
            position: "fixed",
            top: "auto",
            right: "auto",
            display: "flex",
            padding: 10,
            gap: 8,
            zIndex: 10,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
            <button
              onClick={() => setIsNight((v) => !v)}
              style={btnStyle}
              title="Toggle day/night"
            >
              {isNight ? "Day Mode" : "Night Mode"}
            </button>
            <button
              onClick={() => setWalkMode((v) => !v)}
              style={btnStyle}
              title="Toggle Walk/Orbit"
            >
              {walkMode ? "Orbit Mode" : "Walk Mode"}
            </button>
            <button onClick={resetCamera} style={btnStyle} title="Reset camera">
              Reset Camera
            </button>
          </div>
        </div>

        {walkMode && (
          <div
            style={{
              position: "fixed",
              right: "-45vw",
              bottom: "auto",
              margin: 10,
              padding: "8px 10px",
              background: "rgba(0,0,0,0.55)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 12,
              pointerEvents: "none",
            }}
          >
            <div>
              <b>Walk mode</b>
            </div>
            <div>Move: W A S D </div>
            <div>Look Around: Mouse</div>
            <div>Exit: Esc</div>
          </div>
        )}
      </Html>
    </>
  );
};

export default SceneControl;

/* =========================
   Styles
========================= */

const btnStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "#fff",
  cursor: "pointer",
};
