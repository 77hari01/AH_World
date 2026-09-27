export default function Background() {
  return (
    <group>
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#23324a" />
      </mesh>
    </group>
  );
}
