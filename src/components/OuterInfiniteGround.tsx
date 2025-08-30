const OuterInfiniteGround = ({ isNight }: { isNight: boolean }) => {
  // Slightly darker/desaturated than inner grass so the courtyard still “reads” as special
  const color = isNight ? "#0f1a10" : "#c2b280";
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]} // tiny offset to avoid z-fighting with inner ground
      receiveShadow
    >
      <planeGeometry args={[4000, 4000]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
};

export default OuterInfiniteGround;
