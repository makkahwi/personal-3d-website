const WallSconce = ({
  position,
  facing = "in",
  color = "#ffd7a0",
  intensity = 500,
  distance = 6,
  isNight = false,
}: {
  position: [number, number, number];
  facing?: "in" | "out";
  color?: string;
  intensity?: number;
  distance?: number;
  isNight: boolean;
}) => {
  return (
    <group position={position}>
      {/* fixture */}
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.28, 0.12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
      </mesh>

      {/* glow plate */}
      <mesh position={[0, 0, facing === "in" ? 0.08 : -0.08]}>
        <planeGeometry args={[0.2, 0.3]} />
        <meshStandardMaterial
          color="#fff4e4"
          emissive="#c28e46"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* ambient fill (no shadows) */}
      <pointLight
        position={[0, 0, facing === "in" ? 0.15 : -0.15]}
        color={color}
        intensity={isNight ? intensity : 0}
        distance={distance}
        decay={2}
        castShadow={false}
      />
    </group>
  );
};

const WallSconceRow = ({
  wall,
  count = 5,
  y = 5,
  isNight = false,
}: {
  wall: "north" | "south" | "east" | "west";
  count?: number;
  y?: number;
  isNight: boolean;
}) => {
  // inner wall plane extents ~[-25,25], pull in a bit so they sit visually on walls
  const margin = 24.6;
  const step = (2 * margin) / (count - 1);

  const items = Array.from({ length: count }).map((_, i) => {
    const t = -margin + i * step;
    switch (wall) {
      case "north": // z = -25
        return (
          <WallSconce key={i} position={[t, y, -24.9]} isNight={isNight} />
        );
      case "south": // z = 25
        return <WallSconce key={i} position={[t, y, 24.9]} isNight={isNight} />;
      case "east": // x = 25
        return <WallSconce key={i} position={[24.9, y, t]} isNight={isNight} />;
      case "west": // x = -25
      default:
        return (
          <WallSconce key={i} position={[-24.9, y, t]} isNight={isNight} />
        );
    }
  });

  return <>{items}</>;
};

export default WallSconceRow;
