import { Suspense, lazy, useEffect, useState } from "react";

import type { Station } from "./ninefold/stations";

const NinefoldScene = lazy(() => import("./ninefold/NinefoldScene"));

type MoveDir = "up" | "down" | "left" | "right";

function App() {
  const [selected, setSelected] = useState<Station | null>(null);
  const [guided, setGuided] = useState(false);
  const [moveDir, setMoveDir] = useState<MoveDir | null>(null);
  const [introStage, setIntroStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const a = window.setTimeout(() => setIntroStage(1), 1700);
    const b = window.setTimeout(() => setIntroStage(2), 4800);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  return (
    <div className="app-shell">
      <Suspense fallback={<div className="scene-loading">Preparing Ninefold Garden...</div>}>
        <NinefoldScene selected={selected} onSelect={setSelected} guided={guided} moveDir={moveDir} />
      </Suspense>

      {introStage < 2 && (
        <div className="intro-sequence">
          {introStage === 0 ? (
            <p className="intro-sequence-main">3 × 3 = 9</p>
          ) : (
            <p className="intro-sequence-sub">
              A life shaped by three places, three fields of thought, and three careers.
            </p>
          )}
        </div>
      )}

      <div className="intro-banner">
        <p className="formula">3 × 3 = 9</p>
        <h1>Ninefold Garden</h1>
        <p>A life shaped by three places, three fields of thought, and three careers.</p>
      </div>

      <nav className="top-nav">
        <a>About</a><a>Projects</a><a>Resume</a><a>Contact</a>
        <button onClick={() => setGuided((v) => !v)}>{guided ? "Free Mode" : "Guided Tour"}</button>
      </nav>

      {!guided && (
        <div className="mobile-pad">
          <button onMouseDown={() => setMoveDir("up")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("up")} onTouchEnd={() => setMoveDir(null)}>↑</button>
          <div>
            <button onMouseDown={() => setMoveDir("left")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("left")} onTouchEnd={() => setMoveDir(null)}>←</button>
            <button onMouseDown={() => setMoveDir("right")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("right")} onTouchEnd={() => setMoveDir(null)}>→</button>
          </div>
          <button onMouseDown={() => setMoveDir("down")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("down")} onTouchEnd={() => setMoveDir(null)}>↓</button>
        </div>
      )}

      {selected && (
        <aside className="station-panel">
          <p className="id">{selected.id} · {selected.years}</p>
          <h2>{selected.title}</h2>
          <p>{selected.summary}</p>
          <p className="muted">What it shaped</p>
          <ul>{selected.lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul>
          <button onClick={() => setSelected(null)}>Close</button>
        </aside>
      )}
    </div>
  );
}

export default App;
