import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";

export default function Particles() {
  const positions = useMemo(() => {
    const vertices = new Float32Array(900);
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] = (Math.random() - 0.5) * 28;
      vertices[i + 1] = (Math.random() - 0.5) * 16;
      vertices[i + 2] = -Math.random() * 24 + 5;
    }
    return vertices;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#dfe8ff" size={0.025} sizeAttenuation depthWrite={false} opacity={0.38} />
    </Points>
  );
}
