import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Photo from "./Photo.jsx";
import Background from "./Background.jsx";

function generatePhotoLayout(index) {
  const columns = 20;
  const rows = 14;
  const layer = Math.floor(index / (columns * rows));
  const localIndex = index % (columns * rows);
  const row = Math.floor(localIndex / columns);
  const column = localIndex % columns;
  const latitude = -1.38 + ((row + 0.5) / rows) * 2.76;
  const longitude = ((column + 0.5 + layer * 0.5) / columns) * Math.PI * 2;
  const radius = layer === 0 ? 5.35 : 5.7;
  const cosLatitude = Math.cos(latitude);
  const x = Math.cos(longitude) * cosLatitude * radius;
  const y = Math.sin(latitude) * radius;
  const z = Math.sin(longitude) * cosLatitude * radius;
  const scale = layer === 0 ? 1.2 : 1.08;

  return {
    position: [x, y, z],
    scale,
  };
}

function Scene({ photos, onSelectPhoto, onReady }) {
  const groupRef = useRef();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const { gl } = useThree();
  const layouts = useMemo(
    () => photos.map((_, index) => generatePhotoLayout(index)),
    [photos],
  );

  useEffect(() => {
    const element = gl.domElement;
    const handlePointerDown = (event) => {
      drag.current = { active: true, x: event.clientX, y: event.clientY };
      element.setPointerCapture?.(event.pointerId);
    };
    const handlePointerDrag = (event) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      target.current.y += dx * 0.009;
      target.current.x = THREE.MathUtils.clamp(target.current.x + dy * 0.006, -1.05, 1.05);
    };
    const handlePointerUp = (event) => {
      drag.current.active = false;
      element.releasePointerCapture?.(event.pointerId);
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerDrag);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);
    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerDrag);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [gl]);

  useEffect(() => {
    const readyTimer = window.setTimeout(onReady, 900);
    return () => window.clearTimeout(readyTimer);
  }, [onReady]);

  useFrame((state, delta) => {
    current.current.x = THREE.MathUtils.damp(current.current.x, target.current.x, 4.2, delta);
    current.current.y = THREE.MathUtils.damp(current.current.y, target.current.y, 4.2, delta);

    if (groupRef.current) {
      groupRef.current.rotation.x = current.current.x;
      groupRef.current.rotation.y =
        current.current.y + state.clock.elapsedTime * 0.008;
      groupRef.current.position.z = 0;
    }
  });

  return (
    <>
      <color attach="background" args={["#111625"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 7, 5]} intensity={1.5} color="#fff0d3" />
      <pointLight position={[-7, -2, 4]} intensity={4.2} color="#7fe6ff" distance={18} />
      <Background />
      <group ref={groupRef}>
        {photos.map((photo, index) => (
          <Photo
            key={photo.id}
            photo={photo}
            layout={layouts[index]}
            index={index}
            onSelect={onSelectPhoto}
          />
        ))}
      </group>
      <Environment preset="night" />
    </>
  );
}

function SceneFallback() {
  return (
    <>
      <color attach="background" args={["#111625"]} />
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#23324a" />
      </mesh>
    </>
  );
}

export default function PhotoSpace({ photos, onSelectPhoto, onReady }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 72, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
      onCreated={({ gl }) => {
        gl.setClearColor("#101827", 1);
      }}
    >
      <Suspense fallback={<SceneFallback />}>
        <Scene
          photos={photos}
          onSelectPhoto={onSelectPhoto}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
