import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

import photo from "./assets/profile.jpg";
import { personalProfile } from "./data/personalProfile";

import "./App.css";

const trailerSearchUrl = (title: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}`;

const FloatingGlobe = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.16;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.16;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.15, 24, 16]} />
        <meshStandardMaterial
          color="#0f766e"
          emissive="#0d9488"
          emissiveIntensity={0.2}
          roughness={0.26}
          metalness={0.34}
        />
      </mesh>
      {personalProfile.countries.map((country, index) => {
        const angle = (index / personalProfile.countries.length) * Math.PI * 2;
        return (
          <mesh
            key={country.id}
            position={[
              Math.cos(angle) * 1.85,
              Math.sin(index * 1.7) * 0.72,
              Math.sin(angle) * 1.85,
            ]}
          >
            <sphereGeometry args={[0.065, 8, 6]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#f59e0b"
              emissiveIntensity={0.55}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const CinemaObject = ({ position }: { position: [number, number, number] }) => {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.16;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.72 + 2) * 0.14;
  });

  return (
    <group ref={ref} position={position} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.8, 1.5, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0.08]}>
        <boxGeometry args={[2.42, 1.08, 0.03]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
        />
      </mesh>
      {[-0.88, 0, 0.88].map((x, index) => (
        <mesh key={x} position={[x, -0.9, 0.3]} rotation={[0.28, 0, 0]}>
          <boxGeometry args={[0.56, 0.32, 0.62]} />
          <meshStandardMaterial
            color={["#ef4444", "#8b5cf6", "#22c55e"][index]}
            emissive={["#7f1d1d", "#4c1d95", "#14532d"][index]}
            emissiveIntensity={0.24}
          />
        </mesh>
      ))}
    </group>
  );
};

const BooksObject = ({ position }: { position: [number, number, number] }) => {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      -0.3 + Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.64 + 4) * 0.13;
  });

  return (
    <group ref={ref} position={position} rotation={[0, -0.25, 0]}>
      {Array.from({ length: 12 }).map((_, index) => (
        <mesh
          key={index}
          position={[-1.4 + index * 0.25, 0, 0]}
          rotation={[0, 0, ((index % 5) - 2) * 0.055]}
        >
          <boxGeometry args={[0.18, 1.55 - (index % 4) * 0.12, 0.48]} />
          <meshStandardMaterial
            color={
              ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed"][index % 5]
            }
            roughness={0.48}
            metalness={0.12}
          />
        </mesh>
      ))}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[3.45, 0.14, 0.72]} />
        <meshStandardMaterial
          color="#475569"
          roughness={0.32}
          metalness={0.36}
        />
      </mesh>
    </group>
  );
};

const ChoiceObject = ({ position }: { position: [number, number, number] }) => {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.9 + 1) * 0.18;
  });

  return (
    <group ref={ref} position={position}>
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => (
          <mesh
            key={`${col}-${row}`}
            position={[(col - 1) * 0.68, (row - 1) * 0.5, 0]}
          >
            <boxGeometry args={[0.42, 0.28 + row * 0.16, 0.42]} />
            <meshStandardMaterial
              color={["#14b8a6", "#f97316", "#8b5cf6"][col]}
              emissive={["#0f766e", "#9a3412", "#5b21b6"][col]}
              emissiveIntensity={0.22}
              roughness={0.34}
              metalness={0.22}
            />
          </mesh>
        )),
      )}
    </group>
  );
};

const PlayfulOrbit = () => {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.025;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.16;
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 22 }).map((_, index) => {
        const angle = (index / 22) * Math.PI * 2;
        const radius = 4.4 + (index % 4) * 0.62;
        const colors = ["#facc15", "#fb7185", "#22d3ee", "#a78bfa", "#4ade80"];
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.62,
              -1.4 - (index % 3) * 0.65,
            ]}
            rotation={[angle, angle * 0.5, 0]}
          >
            {index % 3 === 0 ? (
              <torusGeometry args={[0.09, 0.025, 6, 10]} />
            ) : (
              <sphereGeometry args={[0.045 + (index % 4) * 0.012, 8, 6]} />
            )}
            <meshStandardMaterial
              color={colors[index % colors.length]}
              emissive={colors[index % colors.length]}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const CameraDrift = () => {
  const scrollProgress = React.useRef(0);

  React.useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - window.innerHeight;
      scrollProgress.current = distance > 0 ? window.scrollY / distance : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pageProgress = scrollProgress.current;
    const targetX = state.pointer.x * 0.65 + Math.sin(time * 0.12) * 0.18;
    const targetY = state.pointer.y * 0.38 + Math.cos(time * 0.16) * 0.12;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.035);
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      8 + Math.sin(pageProgress * Math.PI * 4) * 0.7,
      0.025,
    );
    state.camera.rotation.z = THREE.MathUtils.lerp(
      state.camera.rotation.z,
      (pageProgress - 0.5) * 0.035,
      0.025,
    );
    state.camera.lookAt(0, pageProgress * -0.35, 0);
  });
  return null;
};

// A decorative background does not need to render at the display's full refresh
// rate. Demand rendering keeps laptops and high-refresh screens substantially cooler.
const FrameLimiter = () => {
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) {
        timer = window.setTimeout(() => {
          invalidate();
          schedule();
        }, 1000 / 30);
      }
    };
    const handleVisibility = () => schedule();
    document.addEventListener("visibilitychange", handleVisibility);
    schedule();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearTimeout(timer);
    };
  }, [invalidate]);

  return null;
};

const ScrollComposition = () => {
  const group = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const progress = distance > 0 ? window.scrollY / distance : 0;
    const chapter = progress * Math.PI * 4;

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      Math.sin(chapter) * 0.85,
      0.06,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      Math.cos(chapter * 0.72) * 0.45,
      0.06,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      Math.sin(chapter * 0.5) * 0.055,
      0.05,
    );
  });

  return (
    <group ref={group}>
      <PlayfulOrbit />
      <FloatingGlobe position={[3.25, 1.55, 0]} />
      <ChoiceObject position={[-3.9, -1.05, -0.4]} />
      <CinemaObject position={[3.25, -1.9, -0.3]} />
      <BooksObject position={[-3.8, 2.15, -0.6]} />
    </group>
  );
};

const Stage = () => (
  <div className="stage" aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      dpr={[1, 1.25]}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: "low-power", stencil: false }}
    >
      <FrameLimiter />
      <color attach="background" args={["#f7f4ff"]} />
      <fog attach="fog" args={["#f7f4ff", 9, 18]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#ffffff", "#ddd6fe", 1.5]} />
      <pointLight position={[-4, 3, 5]} intensity={3.2} color="#22d3ee" />
      <pointLight position={[5, -1, 3]} intensity={2.4} color="#fb7185" />
      <CameraDrift />
      <ScrollComposition />
    </Canvas>
  </div>
);

const slugLetters = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("");

const lifestyleShortLabel = (label: string) =>
  label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

const lifestyleMeta = (
  item: (typeof personalProfile.healthyLifestyle.items)[number],
) => {
  const years =
    item.fromYear !== undefined
      ? `${item.fromYear}-${item.toYear ?? "now"}`
      : undefined;

  return [years, item.cadence].filter(Boolean).join(" / ");
};

const lifestyleImages: Record<
  (typeof personalProfile.healthyLifestyle.items)[number]["visualHint"],
  string
> = {
  fasting:
    "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80",
  sleep:
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80",
  sugar:
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
  vegan:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  nutritionist:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80",
  "weight-loss":
    "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=1200&q=80",
  walking:
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80",
  stimulants: "/media/reduced-stimulants.png",
};

const HealthyLifestylePanel = () => {
  const { healthyLifestyle } = personalProfile;
  const featureItem =
    healthyLifestyle.items.find((item) => item.visualHint === "weight-loss") ??
    healthyLifestyle.items[0];
  const supportItems = healthyLifestyle.items.filter(
    (item) => item.id !== featureItem.id,
  );

  return (
    <section className="healthy-lifestyle">
      <div className="section-copy">
        <p className="eyebrow">Habits I keep</p>
        <h2>Small health choices, practiced for years.</h2>
        <p>{healthyLifestyle.summary}</p>
      </div>
      <div className="lifestyle-system" aria-label="Healthy lifestyle habits">
        <article
          className="lifestyle-feature"
          data-hint={featureItem.visualHint}
          style={
            {
              "--lifestyle-image": `url("${lifestyleImages[featureItem.visualHint]}")`,
            } as React.CSSProperties
          }
        >
          <span>{lifestyleMeta(featureItem)}</span>
          <strong>{featureItem.label}</strong>
          <p>{featureItem.note}</p>
        </article>
        {supportItems.map((item) => (
          <article
            key={item.id}
            className="lifestyle-node"
            data-hint={item.visualHint}
            style={
              {
                "--lifestyle-image": `url("${lifestyleImages[item.visualHint]}")`,
              } as React.CSSProperties
            }
          >
            <span>{lifestyleShortLabel(item.label)}</span>
            <strong>{item.label}</strong>
            <small>{lifestyleMeta(item)}</small>
          </article>
        ))}
      </div>
    </section>
  );
};

type ShelfItem = {
  title: string;
  href?: string;
  detail?: string;
  posterImage?: string;
};

const toShelfItem = (item: {
  title: string;
  author?: string;
  note?: string;
  link?: string;
  posterImage?: string;
}): ShelfItem => ({
  title: item.title,
  href: item.link,
  detail: item.author || item.note || (item.link ? "Open link" : undefined),
  posterImage: item.posterImage,
});

const ExperienceLayer = () => {
  const [activeSection, setActiveSection] = React.useState("top");
  const [cursorLabel, setCursorLabel] = React.useState("");

  React.useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateScroll = () => {
      const distance = root.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--scroll-progress",
        String(distance > 0 ? window.scrollY / distance : 0),
      );
    };
    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--scene-x", `${event.clientX / window.innerWidth - 0.5}`);
      root.style.setProperty("--scene-y", `${event.clientY / window.innerHeight - 0.5}`);
    };
    const interactiveSelector = "a, button, .identity-card, .hobby-board article, .lifestyle-node, .lifestyle-feature";
    const updateCursorState = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest(interactiveSelector);
      setCursorLabel(target ? (target.matches("a, button") ? "Open" : "Explore") : "");
    };
    const tiltItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".identity-card, .hobby-board article, .lifestyle-node, .lifestyle-feature, .poster-run a, .shelf-line a",
      ),
    );
    const tilt = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      card.style.setProperty("--tilt-x", `${rx}deg`);
      card.style.setProperty("--tilt-y", `${ry}deg`);
      card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    };
    const resetTilt = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]"),
    );
    const revealItems = document.querySelectorAll<HTMLElement>(
      "section > header, section > .section-copy, .identity-card, .hobby-board article, .lifestyle-feature, .lifestyle-node, .entertainment-collection, .media-shelf",
    );
    revealItems.forEach((item) => item.classList.add("reveal-item"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) {
          const id = (current.target as HTMLElement).id;
          setActiveSection(id);
          const accents: Record<string, string> = {
            top: "#ff477e", story: "#7657e8", everyday: "#04a777",
            entertainment: "#6847d9", library: "#168aad",
          };
          root.style.setProperty("--chapter-accent", accents[id] || "#ff477e");
        }
      },
      { rootMargin: "-35% 0px -50%", threshold: [0, 0.2, 0.6] },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    sections.forEach((section) => sectionObserver.observe(section));
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    if (!reduceMotion.matches) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
      document.addEventListener("pointerover", updateCursorState, { passive: true });
      tiltItems.forEach((item) => {
        item.addEventListener("pointermove", tilt);
        item.addEventListener("pointerleave", resetTilt);
      });
    }
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("pointerover", updateCursorState);
      tiltItems.forEach((item) => {
        item.removeEventListener("pointermove", tilt);
        item.removeEventListener("pointerleave", resetTilt);
      });
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ambient-cursor" aria-hidden="true" />
      <div className={`live-cursor ${cursorLabel ? "is-active" : ""}`} aria-hidden="true">
        {cursorLabel}
      </div>
      <div className="chapter-indicator" aria-hidden="true">
        <span>{activeSection === "top" ? "00" : activeSection === "story" ? "01" : activeSection === "everyday" ? "02" : activeSection === "entertainment" ? "03" : "04"}</span>
        <i />
        <strong>{activeSection}</strong>
      </div>
    </>
  );
};

const App = () => {
  const library = personalProfile.culturalLibrary;
  const movieLinks = library.movies.map((movie) => ({
    title: movie.title,
    year: movie.note,
    href: movie.link || trailerSearchUrl(movie.title),
    posterImage: movie.posterImage,
  }));
  const seriousMediaGroups = (
    [
      { label: "Books", kind: "book", items: library.books },
      {
        label: "Podcasts / Lectures",
        kind: "podcast",
        items: library.podcasts,
      },
      // { label: "Programs", kind: "program", items: library.programs },
      {
        label: "Documentaries",
        kind: "documentary",
        items: library.documentaries.filter((item) => item.title),
      },
    ] satisfies Array<{
      label: string;
      kind: string;
      items: Array<{
        title: string;
        author?: string;
        link?: string;
        posterImage?: string;
      }>;
    }>
  ).map((group) => ({
    ...group,
    items: group.items.map(toShelfItem),
  }));

  const entertainmentMediaGroups = (
    [
      {
        label: "Series",
        kind: "series",
        items: library.series.filter((item) => item.title),
      },
      {
        label: "Games",
        kind: "game",
        items: library.games.filter((item) => item.title),
      },
    ] satisfies Array<{
      label: string;
      kind: string;
      items: Array<{
        title: string;
        author?: string;
        link?: string;
        posterImage?: string;
      }>;
    }>
  ).map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...toShelfItem(item),
      href:
        "link" in item && typeof item.link === "string"
          ? item.link
          : trailerSearchUrl(item.title),
    })),
  }));

  return (
    <main className="landing-page">
      <Stage />
      <ExperienceLayer />

      <nav className="site-nav" aria-label="Main navigation">
        <a className="nav-mark" href="#top" aria-label="Back to top">
          Su 9
        </a>

        <div>
          <a href="#story">Story</a>
          <a href="#everyday">Everyday</a>
          <a href="#entertainment">Play</a>
          <a href="#library">Ideas</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">{personalProfile.site.scope}</p>
        <div className="hero-row">
          <div className="hero-brand">
            <strong>9</strong>
            <div>
              <h1>The paths that made me.</h1>
              <p>
                Three life paths. Three chapters in each. Together, they make
                nine.
              </p>
              <a className="enter-link" href="#story">
                <span>Begin the journey</span>
                <b aria-hidden="true">↘</b>
              </a>
            </div>
          </div>
          <div className="profile-card">
            <div
              className="profile-photo"
              role="img"
              aria-label="Profile photo placeholder"
            >
              <img src={photo} alt="Profile photo" />
            </div>

            <div className="profile-copy">
              <span className="profile-kicker">Hello, I am</span>
              <h2>Suhaib</h2>
              <p>
                a curious builder shaped by technology, travel, and continuous
                learning. I enjoy exploring thoughtful ideas, healthy routines,
                and the small details that make life meaningful.
              </p>
              {/* <div className="profile-tags">
                <span>📍 Amman</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <div className="motion-ticker" aria-hidden="true">
        <div>
          <span>STUDY</span><i>✦</i><span>WORK</span><i>✦</i><span>PLACE</span><i>✦</i>
          <span>STUDY</span><i>✦</i><span>WORK</span><i>✦</i><span>PLACE</span><i>✦</i>
        </div>
      </div>

      <section className="identity-map" id="story">
        <header className="identity-heading">
          <p className="eyebrow">Study · Work · Place</p>
          <h2>Three paths. Nine defining chapters.</h2>
          <p>{personalProfile.nineChoices.summary}</p>
        </header>

        <div className="identity-grid">
          {personalProfile.nineChoices.groups.map((group, groupIndex) => (
            <article
              key={group.id}
              className={`identity-card identity-${group.id}`}
            >
              <div className="identity-card-copy">
                <p className="eyebrow">
                  Path {String(groupIndex + 1).padStart(2, "0")} · {group.label}
                </p>
                <h3>
                  {group.id === "stays"
                    ? "Three places I've lived."
                    : group.id === "study"
                      ? "The route to coding."
                      : "From finance to design to code."}
                </h3>
                <p>
                  {group.id === "stays"
                    ? "Makkah, Kuala Lumpur, and Amman are the three places that shaped my society, sense of home and identity."
                    : group.summary}
                </p>
              </div>

              {group.id === "study" && (
                <div className="pathway">
                  {personalProfile.educationPath.map((step) => (
                    <div key={step.id}>
                      <span>{step.status}</span>
                      <strong>{step.field}</strong>
                    </div>
                  ))}
                </div>
              )}
              {group.id === "career" && (
                <div className="career-bars">
                  {personalProfile.professionalBackground.phases.map(
                    (phase) => (
                      <div key={phase.id}>
                        <span>
                          {phase.fromYear}-{phase.toYear}
                        </span>
                        <strong>{phase.label}</strong>
                      </div>
                    ),
                  )}
                </div>
              )}
              {group.id === "stays" && (
                <div className="stay-bars">
                  {personalProfile.stays.map((stay, index) => (
                    <div key={stay.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{stay.label}</strong>
                      <small>
                        {stay.fromYear}-{stay.toYear}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="hobby-ribbon" id="everyday">
        <p className="eyebrow">Beyond the screen</p>
        <h2>Cooking, movement, machines, and a good story.</h2>
        <div className="hobby-board">
          {personalProfile.hobbies.map((hobby) => (
            <article
              key={hobby.id}
              style={
                {
                  "--hobby-image": hobby.image
                    ? `url("${hobby.image}")`
                    : undefined,
                } as React.CSSProperties
              }
            >
              <span>{hobby.category}</span>
              <strong>{hobby.label}</strong>
            </article>
          ))}
        </div>
      </section>

      <HealthyLifestylePanel />

      <section
        className="cinema-wall content-zone entertainment-zone"
        id="entertainment"
      >
        <div className="section-copy">
          <p className="eyebrow">What keeps me entertained</p>
          <h2>Mysteries, strategy, comedy, and worlds to explore.</h2>
          <p>Stories, screens, and play—the lighter side of the collection.</p>
        </div>
        <article className="entertainment-collection movie-collection">
          <header className="collection-heading">
            <span>01</span>
            <strong>Movies</strong>
            <small>Trailers &amp; favorites</small>
          </header>
          <div className="poster-run" aria-label="Movies">
            {movieLinks
              .sort(
                (a, b) =>
                  b.year?.localeCompare(a.year ?? "") ||
                  b.title.localeCompare(a.title),
              )
              .map((movie, index) => (
                <a
                  key={movie.title}
                  href={movie.href}
                  target="_blank"
                  rel="noreferrer"
                  style={
                    {
                      "--poster": movie.posterImage
                        ? `url("${movie.posterImage}")`
                        : undefined,
                      "--hue": index * 23,
                    } as React.CSSProperties
                  }
                >
                  <span>{movie.year || "Trailer"}</span>
                  <b>{slugLetters(movie.title)}</b>
                  <em>{movie.title}</em>
                </a>
              ))}
          </div>
        </article>
        <div className="classified-shelves entertainment-shelves">
          {entertainmentMediaGroups.map((group) => (
            <article
              key={group.label}
              className="media-shelf"
              data-kind={group.kind}
            >
              <header className="collection-heading">
                <span>{group.kind === "series" ? "02" : "03"}</span>
                <strong>{group.label}</strong>
                <small>
                  {group.kind === "series"
                    ? "Shows & seasons"
                    : "Digital & tabletop"}
                </small>
              </header>
              <div className="shelf-line">
                {group.items
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Watch the official trailer for ${item.title}`}
                    >
                      {item.posterImage ? (
                        <img src={item.posterImage} alt="" loading="lazy" />
                      ) : (
                        <b>{slugLetters(item.title)}</b>
                      )}
                      <strong>{item.title}</strong>
                      <span>
                        {item.detail ? `${item.detail} · ` : ""}Official trailer
                        ↗
                      </span>
                    </a>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="library-shelf" id="library">
        <div className="section-copy">
          <p className="eyebrow">Ideas that stay with me</p>
          <h2>What I read and watch to understand the world.</h2>
          <p>
            My shelf moves across faith, politics, history, society, economics,
            and personal growth.
          </p>
        </div>
        <div className="classified-shelves">
          {seriousMediaGroups.map((group) => (
            <article
              key={group.label}
              className="media-shelf"
              data-kind={group.kind}
            >
              <header>
                <strong>{group.label}</strong>
              </header>
              <div className="shelf-line">
                {group.items
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) =>
                    item.href ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.posterImage ? (
                          <img src={item.posterImage} alt="" loading="lazy" />
                        ) : (
                          <b>{slugLetters(item.title)}</b>
                        )}
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </a>
                    ) : (
                      <div key={item.title}>
                        {item.posterImage ? (
                          <img src={item.posterImage} alt="" loading="lazy" />
                        ) : (
                          <b>{slugLetters(item.title)}</b>
                        )}
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                    ),
                  )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* <section className="future-board">
        <div className="section-copy">
          <p className="eyebrow">Make it more yours</p>
          <h2>Good next additions.</h2>
          <p>
            These placeholders are ready to replace with real personal details.
          </p>
        </div>
        <div className="future-grid">
          <article>
            <span>NOW</span>
            <strong>Currently into</strong>
            <p>
              Add a rotating favorite, current project, or recent discovery.
            </p>
          </article>
          <article>
            <span>PLAY</span>
            <strong>Personal soundtrack</strong>
            <p>Add a favorite playlist or three songs that feel like you.</p>
          </article>
          <article>
            <span>SNAP</span>
            <strong>Mini photo diary</strong>
            <p>
              Add candid photos from food, walks, travel, and ordinary days.
            </p>
          </article>
          <article>
            <span>ASK</span>
            <strong>Ask me about</strong>
            <p>Add three conversation starters visitors can use to know you.</p>
          </article>
        </div>
      </section> */}

      <footer>
        <p>{personalProfile.socialMedia.generalNote}</p>
        <div>
          {personalProfile.socialMedia.accounts.map((account) => (
            <a
              key={account.id}
              href={account.link}
              target="_blank"
              rel="noreferrer"
            >
              {account.platform}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
};

export default App;
