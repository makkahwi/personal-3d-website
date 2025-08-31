import * as React from "react";
import { createPortal } from "react-dom";

type Props = {
  walkMode: boolean;
  setWalkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isNight: boolean;
  setIsNight: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
  // optional extras you can wire later:
  speed?: number;
  setSpeed?: React.Dispatch<React.SetStateAction<number>>;
};

const BottomBar: React.FC<Props> = ({
  walkMode,
  setWalkMode,
  isNight,
  setIsNight,
  onReset,
  speed,
  setSpeed,
}) => {
  return createPortal(
    // Html fullscreen parent will wrap this; keep outer container non-interactive
    <div
      style={{
        position: "fixed",
        left: "-30vw",
        bottom: "-45vh",
        display: "flex",
        justifyContent: "center",
        zIndex: 20,
        width: "60vw",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderRadius: 14,
          background: "rgba(15,15,22,0.65)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 10, margin: "auto" }}>
          {/* Left group: buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setIsNight((v) => !v)}
              title="Toggle Day/Night"
              style={btn}
            >
              {isNight ? "🌙 Night" : "🌞 Day"}
            </button>

            <button
              onClick={() => setWalkMode((v) => !v)}
              title="Toggle Walk/Orbit"
              style={btn}
            >
              Switch from {walkMode ? "🕹️ Walk" : "🛰️ Orbit"} to{" "}
              {walkMode ? "🛰️ Orbit" : "🕹️ Walk"}
            </button>

            <button onClick={onReset} title="Reset Camera" style={btn}>
              🔄 Reset
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.12)",
            }}
          />

          {/* Instructions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span style={{ opacity: 0.7 }}>Controls</span>

            {walkMode ? (
              <>
                <Key>W</Key>
                <Key>A</Key>
                <Key>S</Key>
                <Key>D</Key>
                <span style={{ opacity: 0.7 }}>to move</span>
                <Bullet />
                <span style={{ opacity: 0.9 }}>Mouse:</span>
                <span style={{ opacity: 0.7 }}>to look around</span>
                <Bullet />
                <Key wide>Esc</Key>
                <span style={{ opacity: 0.7 }}>to release</span>
              </>
            ) : (
              <div>
                <span style={{ opacity: 0.9 }}>Mouse</span>
              </div>
            )}
          </div>

          {/* Optional speed control (only shows if provided) */}
          {typeof speed === "number" && setSpeed && (
            <>
              <div
                style={{
                  width: 1,
                  height: 24,
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ opacity: 0.9 }}>Speed</span>
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={0.5}
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  style={{ width: 120 }}
                />
                <span style={{ opacity: 0.7 }}>{speed.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BottomBar;

/* ---------- UI bits ---------- */

const btn: React.CSSProperties = {
  appearance: "none",
  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 13,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
};

const Key: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({
  children,
  wide,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: wide ? 36 : 22,
      height: 22,
      padding: "0 6px",
      borderRadius: 6,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      fontSize: 12,
    }}
  >
    {children}
  </span>
);

const Bullet: React.FC = () => (
  <span
    style={{
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.35)",
      display: "inline-block",
      margin: "0 6px",
    }}
  />
);
