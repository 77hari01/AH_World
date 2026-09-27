import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Photo({ photo, layout, index, onSelect }) {
  const texture = useTexture(photo.src);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.lookAt(0, 0, 0);
  }, [photo.index]);

  const dimensions = useMemo(() => {
    const aspect = texture.image?.width && texture.image?.height
      ? texture.image.width / texture.image.height
      : 4 / 3;
    const safeAspect = THREE.MathUtils.clamp(aspect, 0.82, 1.42);
    const baseHeight = 1.12 * layout.scale;
    return [baseHeight * safeAspect, baseHeight];
  }, [texture, layout.scale]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.lookAt(0, 0, 0);
    const float = Math.sin(state.clock.elapsedTime * 0.9 + index * 0.7) * 0.045;
    meshRef.current.position.y = layout.position[1] + float;
    const targetScale = hovered ? 1.13 : 1;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 8, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 8, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 8, delta);
  });

  return (
    <group position={layout.position}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(photo);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={dimensions} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
