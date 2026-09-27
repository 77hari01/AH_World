import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Photo from "./Photo.jsx";
import Particles from "./Particles.jsx";

function generatePhotoLayout(index, count) {
  const radius = Math.max(10.5, 10.5 + Math.sqrt(count) * 0.28);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / Math.max(1, count - 1)) * 2;
  const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * index + Math.sin(index * 2.31) * 0.12;
  const depth = radius + Math.sin(index * 1.7) * 0.55;
  const position = [
    Math.cos(theta) * ringRadius * depth,
    y * depth * 0.92 + Math.sin(index * 0.83) * 0.35,
    Math.sin(theta) * ringRadius * depth,
  ];

  return { position, scale: 0.92 + (index % 5) * 0.075, rotation: (index % 2 ? -1 : 1) * (0.02 + (index % 7) * 0.009) };
}

function Scene({ photos, onSelectPhoto, onReady }) {
  const groupRef = useRef();
  const target = useRef({ pitch: 0, yaw: 0 });
  const current = useRef({ pitch: 0, yaw: 0 });
  const velocity = useRef({ pitch: 0, yaw: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const { gl, invalidate } = useThree();
  const layouts = useMemo(
    () => photos.map((_, index) => generatePhotoLayout(index, photos.length)),
    [photos],
  );

  useEffect(() => {
    const element = gl.domElement;
    const handlePointerDown = (event) => {
      drag.current = { active: true, x: event.clientX, y: event.clientY };
      element.setPointerCapture?.(event.pointerId);
      invalidate();
    };
    const handlePointerDrag = (event) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      velocity.current.yaw = dx * 0.0036;
      velocity.current.pitch = dy * 0.0026;
      target.current.yaw += dx * 0.0036;
      target.current.pitch = THREE.MathUtils.clamp(target.current.pitch + dy * 0.0026, -1.28, 1.28);
      invalidate();
    };
    const handlePointerUp = (event) => {
      drag.current.active = false;
      element.releasePointerCapture?.(event.pointerId);
      invalidate();
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
  }, [gl, invalidate]);

  useEffect(() => {
    const readyTimer = window.setTimeout(onReady, 900);
    return () => window.clearTimeout(readyTimer);
  }, [onReady]);

  useFrame((_, delta) => {
    if (!drag.current.active) target.current.yaw += delta * 0.035;
    target.current.yaw += velocity.current.yaw;
    target.current.pitch = THREE.MathUtils.clamp(target.current.pitch + velocity.current.pitch, -1.28, 1.28);
    velocity.current.yaw *= Math.pow(0.91, delta * 60);
    velocity.current.pitch *= Math.pow(0.88, delta * 60);
    current.current.pitch = THREE.MathUtils.damp(current.current.pitch, target.current.pitch, 5.5, delta);
    current.current.yaw = THREE.MathUtils.damp(current.current.yaw, target.current.yaw, 5.5, delta);

    if (groupRef.current) {
      groupRef.current.rotation.x = current.current.pitch;
      groupRef.current.rotation.y = current.current.yaw;
    }

    if (
      !drag.current.active
      || Math.abs(velocity.current.yaw) > 0.001
      || Math.abs(velocity.current.pitch) > 0.001
      || Math.abs(current.current.pitch - target.current.pitch) > 0.001
      || Math.abs(current.current.yaw - target.current.yaw) > 0.001
    ) {
      invalidate();
    }
  });

  return (
    <>
      <color attach="background" args={["#111625"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 7, 5]} intensity={1.1} color="#fff0d3" />
      <pointLight position={[-7, -2, 4]} intensity={5} color="#6ecbff" distance={24} />
      <pointLight position={[8, 3, -5]} intensity={3} color="#a680ff" distance={24} />
      <Particles />
      <group ref={groupRef}>
        {photos.map((photo, index) => (
          <Photo
            key={photo.id}
            photo={photo}
            layout={layouts[index]}
            onSelect={onSelectPhoto}
          />
        ))}
      </group>
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
      camera={{ position: [0, 0, 0], fov: 74, near: 0.1, far: 80 }}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      dpr={[1, 1.25]}
      frameloop="demand"
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
