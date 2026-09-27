import { useCursor, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Photo({ photo, layout, onSelect }) {
  const texture = useTexture(photo.textureSrc ?? photo.src);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const invalidate = useThree((state) => state.invalidate);
  useCursor(hovered);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.lookAt(0, 0, 0);
    meshRef.current.rotateZ(layout.rotation);
  }, [layout.rotation]);

  const dimensions = useMemo(() => {
    const aspect = texture.image?.width && texture.image?.height
      ? texture.image.width / texture.image.height
      : 6 / 5;
    const safeAspect = THREE.MathUtils.clamp(aspect, 0.82, 1.42);
    const baseHeight = 3.05 * layout.scale;
    return [baseHeight * safeAspect, baseHeight];
  }, [texture, layout.scale]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.13 : 1;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 8, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 8, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 8, delta);
    if (Math.abs(meshRef.current.scale.x - targetScale) > 0.001) invalidate();
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
          invalidate();
        }}
        onPointerOut={() => {
          setHovered(false);
          invalidate();
        }}
      >
        <mesh position={[0, 0, -0.018]} scale={[1.04, 1.04, 1]}>
          <planeGeometry args={[dimensions[0], dimensions[1]]} />
          <meshBasicMaterial color="#091021" transparent opacity={0.82} />
        </mesh>
        <planeGeometry args={dimensions} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite
        />
      </mesh>
    </group>
  );
}
