import * as React from "react";

const Signpost: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => (
  <group position={position}>
    {/* pole */}
    <mesh castShadow>
      <cylinderGeometry args={[0.07, 0.08, 5.2, 12]} />
      <meshStandardMaterial color="#655a4a" roughness={0.9} />
    </mesh>
    {/* arms */}
    {[
      { y: 0.9, rotY: 0.0, label: "Makkah →" },
      { y: 1.3, rotY: Math.PI / 3, label: "Malaysia →" },
      { y: 1.7, rotY: -Math.PI / 4, label: "Jordan →" },
    ].map((a, i) => (
      <group key={i} rotation={[0, a.rotY, 0]} position={[0, a.y, 0]}>
        <mesh castShadow position={[0.55, 0, 0]}>
          <boxGeometry args={[1.2, 0.2, 0.08]} />
          <meshStandardMaterial color="#d6c3a2" roughness={0.85} />
        </mesh>
        {a.label}
      </group>
    ))}
  </group>
);

export default Signpost;
