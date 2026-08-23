import { Canvas, useFrame } from "@react-three/fiber";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";

import type { FeatureCollection, Polygon } from "geojson";
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

const Stage = () => (
  <div className="stage" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[-4, 3, 5]} intensity={2.6} color="#22d3ee" />
      <pointLight position={[5, -1, 3]} intensity={1.7} color="#f97316" />
      <FloatingGlobe position={[3.25, 1.55, 0]} />
      <ChoiceObject position={[-3.9, -1.05, -0.4]} />
      <CinemaObject position={[3.25, -1.9, -0.3]} />
      <BooksObject position={[-3.8, 2.15, -0.6]} />
    </Canvas>
  </div>
);

const worldLand: FeatureCollection<Polygon, { name: string }> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "North America" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-168, 72],
            [-142, 70],
            [-124, 58],
            [-116, 49],
            [-96, 50],
            [-78, 58],
            [-54, 50],
            [-60, 30],
            [-84, 15],
            [-104, 20],
            [-118, 32],
            [-129, 48],
            [-150, 58],
            [-168, 72],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "South America" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-82, 12],
            [-62, 9],
            [-46, -8],
            [-38, -23],
            [-50, -55],
            [-68, -52],
            [-76, -28],
            [-82, 12],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Europe Asia Africa" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-18, 36],
            [-10, 60],
            [26, 70],
            [72, 64],
            [122, 50],
            [150, 56],
            [168, 42],
            [138, 18],
            [106, 8],
            [82, 24],
            [62, 8],
            [42, 12],
            [34, -34],
            [18, -35],
            [4, -18],
            [-16, 6],
            [-18, 36],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Arabia India Southeast Asia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [34, 32],
            [56, 28],
            [78, 7],
            [100, 4],
            [119, -7],
            [104, -12],
            [84, 18],
            [62, 22],
            [48, 13],
            [34, 32],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Australia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [112, -12],
            [154, -18],
            [150, -40],
            [118, -44],
            [112, -12],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Greenland" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-52, 60],
            [-28, 70],
            [-38, 82],
            [-62, 78],
            [-52, 60],
          ],
        ],
      },
    },
  ],
};

const WorldMap = () => {
  const width = 1000;
  const height = 520;
  const projection = geoNaturalEarth1().fitExtent(
    [
      [30, 20],
      [width - 30, height - 20],
    ],
    { type: "Sphere" },
  );
  const path = geoPath(projection);
  const spherePath = path({ type: "Sphere" }) ?? "";
  const graticulePath = path(geoGraticule10()) ?? "";

  return (
    <div className="world-map" aria-label="Visited countries map">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <path className="map-sphere" d={spherePath} />
        <path className="map-grid" d={graticulePath} />
        {worldLand.features.map((feature) => (
          <path
            key={feature.properties.name}
            className="map-land"
            d={path(feature) ?? ""}
          />
        ))}
        {personalProfile.countries.map((country) => {
          const [x, y] = projection([...country.coordinates]) ?? [0, 0];
          return (
            <g
              key={country.id}
              className="map-pin"
              transform={`translate(${x} ${y})`}
            >
              <circle r="13" />
              <text y="-20">{country.flag}</text>
              <title>
                {country.name}
                {country.yearVisited ? `, ${country.yearVisited}` : ""}
              </title>
            </g>
          );
        })}
      </svg>
      <div className="map-legend">
        {personalProfile.stays.map((stay) => (
          <span key={stay.id}>{stay.destination}</span>
        ))}
      </div>
    </div>
  );
};

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

const lifestyleMeta = (item: (typeof personalProfile.healthyLifestyle.items)[number]) => {
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
      { label: "Podcasts", kind: "podcast", items: library.podcasts },
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

      <section className="choice-band">
        <div>
          <p className="eyebrow">Identity Map</p>
          <h2>{personalProfile.nineChoices.title} choices</h2>
        </div>
        {personalProfile.nineChoices.groups.map((group, groupIndex) => (
          <article key={group.id}>
            <span className="choice-glyph">{groupIndex + 1}</span>
            <strong>{group.label}</strong>
            <p>{group.summary}</p>
            <div className="choice-nodes">
              {group.choices.map((choice) => (
                <abbr key={choice.id} title={choice.detail}>
                  {choice.label}
                </abbr>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="travel-flow">
        <div className="section-copy">
          <p className="eyebrow">Places</p>
          <h2>Some cities stay louder than others.</h2>
          <p>
            Makkah, Kuala Lumpur, and Amman are the fixed pins. The rest orbit
            as travel memory.
          </p>
        </div>
        <WorldMap />
      </section>

      <section className="two-lanes">
        <div className="lane">
          <p className="eyebrow">Study</p>
          <h2>Academic detours, then computer science.</h2>
          <div className="pathway">
            {personalProfile.educationPath.map((step) => (
              <div key={step.id}>
                <span>{step.status}</span>
                <strong>{step.field}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="lane">
          <p className="eyebrow">Work Context</p>
          <h2>A background line, not the whole story.</h2>
          <div className="career-bars">
            {personalProfile.professionalBackground.phases.map((phase) => (
              <div key={phase.id}>
                <span>
                  {phase.fromYear}-{phase.toYear}
                </span>
                <strong>{phase.label}</strong>
              </div>
            ))}
          </div>
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
          {movieLinks.map((movie, index) => (
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
              <span>{movie.year || "Trailer"}</span>
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
