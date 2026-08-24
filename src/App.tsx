import { Canvas, useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

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
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.16;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.15, 48, 32]} />
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
            <sphereGeometry args={[0.065, 16, 12]} />
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
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.72 + 2) * 0.14;
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
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.64 + 4) * 0.13;
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
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + 1) * 0.18;
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
              <torusGeometry args={[0.09, 0.025, 8, 18]} />
            ) : (
              <sphereGeometry args={[0.045 + (index % 4) * 0.012, 12, 8]} />
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
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(time * 0.12) * 0.24;
    state.camera.position.y = Math.cos(time * 0.16) * 0.18;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Stage = () => (
  <div className="stage" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#071326"]} />
      <fog attach="fog" args={["#071326", 9, 18]} />
      <ambientLight intensity={0.68} />
      <hemisphereLight args={["#67e8f9", "#4c1d95", 1.1]} />
      <pointLight position={[-4, 3, 5]} intensity={3.2} color="#22d3ee" />
      <pointLight position={[5, -1, 3]} intensity={2.4} color="#fb7185" />
      <pointLight position={[0, 5, 1]} intensity={1.8} color="#facc15" />
      <CameraDrift />
      <PlayfulOrbit />
      <FloatingGlobe position={[3.25, 1.55, 0]} />
      <ChoiceObject position={[-3.9, -1.05, -0.4]} />
      <CinemaObject position={[3.25, -1.9, -0.3]} />
      <BooksObject position={[-3.8, 2.15, -0.6]} />
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
        <p className="eyebrow">Healthy Lifestyle</p>
        <h2>Care routines with a long memory.</h2>
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
  link?: string;
  posterImage?: string;
}): ShelfItem => ({
  title: item.title,
  href: item.link,
  detail: item.author || "Open link",
  posterImage: item.posterImage,
});

const App = () => {
  const library = personalProfile.culturalLibrary;
  const movieLinks = library.movies.map((movie) => ({
    title: movie.title,
    year: movie.note,
    href: movie.link || trailerSearchUrl(movie.title),
    posterImage: movie.posterImage,
  }));
  const mediaGroups = (
    [
      { label: "Books", kind: "book", items: library.books },
      {
        label: "Podcasts / Lectures",
        kind: "podcast",
        items: library.podcasts,
      },
      { label: "Programs", kind: "program", items: library.programs },
      {
        label: "Documentaries",
        kind: "documentary",
        items: library.documentaries.filter((item) => item.title),
      },
      {
        label: "Series",
        kind: "series",
        items: library.series.filter((item) => item.title),
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

  return (
    <main className="landing-page">
      <Stage />

      <section className="hero">
        <p className="eyebrow">{personalProfile.site.scope}</p>
        <div className="hero-brand">
          <strong>9</strong>
          <div>
            <h1>Three by three life map.</h1>
            <p>Study, work, and place. Three choices each.</p>
          </div>
        </div>
      </section>

      <section className="identity-map">
        <header className="identity-heading">
          <p className="eyebrow">Identity Map</p>
          <h2>Three parts of one story.</h2>
          <p>{personalProfile.nineChoices.summary}</p>
        </header>

        <div className="identity-grid">
          {personalProfile.nineChoices.groups.map((group) => (
            <article
              key={group.id}
              className={`identity-card identity-${group.id}`}
            >
              <div className="identity-card-copy">
                <p className="eyebrow">
                  {group.id === "career"
                    ? "Work Context"
                    : group.id === "stays"
                      ? "Places"
                      : group.label}
                </p>
                <h3>
                  {group.id === "stays"
                    ? "Three places I've lived."
                    : group.id === "study"
                      ? "The route to coding."
                      : "A background line."}
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
                      <small>{stay.fromYear}-{stay.toYear}</small>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="hobby-ribbon">
        <p className="eyebrow">Everyday</p>
        <h2>Not everything needs a portfolio case study.</h2>
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

      <section className="cinema-wall">
        <div className="section-copy">
          <p className="eyebrow">Cinema</p>
          <h2>Movies as mood markers.</h2>
          <p>
            Each title opens the provided link or a YouTube search for the
            official trailer.
          </p>
        </div>
        <div className="poster-run">
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
                    "--shift": `${(index % 4) * 8}px`,
                  } as React.CSSProperties
                }
              >
                <span
                  className="p-2"
                  style={{
                    backgroundColor: `rgba(0,0,0,0.5)`,
                    width: "max-content",
                    padding: "0.1rem",
                  }}
                >
                  {movie.year || "Trailer"}
                </span>

                <b>{slugLetters(movie.title)}</b>
                <em>{movie.title}</em>
              </a>
            ))}
        </div>
      </section>

      <section className="library-shelf">
        <div className="section-copy">
          <p className="eyebrow">Books / Audio / Shows</p>
          <h2>A shelf for the heavier stuff.</h2>
        </div>
        <div className="classified-shelves">
          {mediaGroups.map((group) => (
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
