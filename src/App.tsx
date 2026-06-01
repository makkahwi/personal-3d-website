import { Suspense, lazy, useEffect, useState } from "react";
import { sections } from "./content/sections";
import type { Station } from "./types/station";

const NinefoldScene = lazy(() => import("./ninefold/NinefoldScene"));
type MoveDir = "up" | "down" | "left" | "right";
type SectionKey = keyof typeof sections;

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [guided, setGuided] = useState(false);
  const [moveDir, setMoveDir] = useState<MoveDir | null>(null);
  const [introStage, setIntroStage] = useState<0 | 1 | 2>(0);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  useEffect(() => { fetch("/data/stations.json").then((r) => r.json()).then(setStations); }, []);
  useEffect(() => {
    const a = window.setTimeout(() => setIntroStage(1), 1700);
    const b = window.setTimeout(() => setIntroStage(2), 4800);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, []);

  return (
    <div className="app-shell">
      <Suspense fallback={<div className="scene-loading">Preparing Ninefold Garden...</div>}>
        <NinefoldScene stations={stations} selected={selected} onSelect={setSelected} guided={guided} moveDir={moveDir} />
      </Suspense>

      {introStage < 2 && <div className="intro-sequence">{introStage === 0 ? <p className="intro-sequence-main">3 × 3 = 9</p> : <p className="intro-sequence-sub">A life shaped by three places, three fields of thought, and three careers.</p>}</div>}
      <div className="intro-banner"><p className="formula">3 × 3 = 9</p><h1>Ninefold Garden</h1><p>A life map of intentional transitions.</p></div>

      <nav className="top-nav">
        <a onClick={() => setActiveSection("about")}>About</a>
        <a onClick={() => setActiveSection("projects")}>Projects</a>
        <a onClick={() => setActiveSection("resume")}>Resume</a>
        <a onClick={() => setActiveSection("contact")}>Contact</a>
        <button onClick={() => setGuided((v) => !v)}>{guided ? "Free Mode" : "Guided Tour"}</button>
      </nav>

      {!guided && <div className="mobile-pad"><button onMouseDown={() => setMoveDir("up")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("up")} onTouchEnd={() => setMoveDir(null)}>↑</button><div><button onMouseDown={() => setMoveDir("left")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("left")} onTouchEnd={() => setMoveDir(null)}>←</button><button onMouseDown={() => setMoveDir("right")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("right")} onTouchEnd={() => setMoveDir(null)}>→</button></div><button onMouseDown={() => setMoveDir("down")} onMouseUp={() => setMoveDir(null)} onTouchStart={() => setMoveDir("down")} onTouchEnd={() => setMoveDir(null)}>↓</button></div>}

      {selected && <aside className="station-panel"><p className="id">{selected.id} · {selected.years}</p><h2>{selected.title}</h2><p>{selected.summary}</p><p className="muted">Key lessons</p><ul>{selected.lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul><p className="muted">Gallery</p><div className="gallery">{selected.images.map((src) => <img key={src} src={src} alt={selected.title} />)}</div><button onClick={() => setSelected(null)}>Close</button></aside>}
      {activeSection && <aside className="section-panel"><h3>{activeSection[0].toUpperCase() + activeSection.slice(1)}</h3><p>{sections[activeSection]}</p><button onClick={() => setActiveSection(null)}>Close</button></aside>}
    </div>
  );
}

export default App;
