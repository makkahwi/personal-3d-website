const GardenLamp = ({
  position,
  isNight,
}: {
  position: [number, number, number];
  isNight: boolean;
}) => {
  // pole + bulb + point light
  return (
    <group position={position}>
      <pointLight
        position={[position[0], 2, position[2]]}
        intensity={isNight ? 11 : 0}
        distance={9}
        decay={2}
        color="#ffd9a1"
        castShadow
      />

      {/* pole */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.12, 2.2, 12]} />
        <meshStandardMaterial color="#474747" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      {/* bulb */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          emissive="#000000"
          emissiveIntensity={0.0}
          color="#dddddd"
        />
      </mesh>
    </group>
  );
};

export default GardenLamp;
