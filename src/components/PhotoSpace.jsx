import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Photo from "./Photo.jsx";
import Particles from "./Particles.jsx";

function generatePhotoLayout(index, count, isMobile = false) {
  const baseRadius = isMobile ? 7.8 : 10.5;
  const radiusGrowth = isMobile ? 0.14 : 0.28;
  const radius = Math.max(baseRadius, baseRadius + Math.sqrt(count) * radiusGrowth);
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
  const baseScale = isMobile ? 0.76 : 0.92;
  const scaleVariation = isMobile ? 0.035 : 0.075;
  return { position, scale: baseScale + (index % 5) * scaleVariation, rotation: (index % 2 ? -1 : 1) * (0.02 + (index % 7) * 0.009) };
}

function Scene({ photos, onSelectPhoto, onReady, isMobile }) {
  const groupRef = useRef();
  const target = useRef({ pitch: 0, yaw: 0 });
  const current = useRef({ pitch: 0, yaw: 0 });
  const velocity = useRef({ pitch: 0, yaw: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const { gl, invalidate } = useThree();
  const dragSensitivity = isMobile ? 0.008 : 0.0036;
  const pitchSensitivity = isMobile ? 0.005 : 0.0026;
  
  const layouts = useMemo(
    () => photos.map((_, index) => generatePhotoLayout(index, photos.length, isMobile)),
    [photos, isMobile],
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
      velocity.current.yaw = dx * dragSensitivity;
      velocity.current.pitch = dy * pitchSensitivity;
      target.current.yaw += dx * dragSensitivity;
      target.current.pitch = THREE.MathUtils.clamp(target.current.pitch + dy * pitchSensitivity, -1.28, 1.28);
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
          <Suspense key={photo.id} fallback={null}>
            <Photo
              photo={photo}
              layout={layouts[index]}
              isMobile={isMobile}
              onSelect={onSelectPhoto}
            />
          </Suspense>
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
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const updateDeviceSize = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", updateDeviceSize);
    return () => mediaQuery.removeEventListener("change", updateDeviceSize);
  }, []);

  const dprValue = isMobile ? [1, 1.05] : [1, 1.25];
  const fov = isMobile ? 72 : 74;

  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: fov, near: 0.1, far: 80 }}
      gl={{ antialias: false, alpha: false, powerPreference: isMobile ? "low-power" : "low-power" }}
      dpr={dprValue}
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
          isMobile={isMobile}
        />
      </Suspense>
    </Canvas>
  );
}
