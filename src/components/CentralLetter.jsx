import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function CentralLetter({ letter }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={ref}>
      <Text
        position={[0.08, -0.08, -0.07]}
        fontSize={3.9}
        fontWeight={900}
        anchorX="center"
        anchorY="middle"
        color="#171a22"
      >
        {letter}
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={3.85}
        fontWeight={900}
        anchorX="center"
        anchorY="middle"
        color="#f4eee1"
        outlineColor="#fff8dc"
        outlineWidth={0.012}
      >
        {letter}
      </Text>
      <pointLight position={[0, 0, 1.2]} intensity={2.5} color="#ffe6b5" distance={7} />
    </group>
  );
}
