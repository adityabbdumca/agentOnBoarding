import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useLayoutEffect, Suspense, useEffect } from "react";
import * as THREE from "three";
import LoaderAnimation from "./LoaderAnimation";

const LoginSide = () => {
  const someRef = useRef();

  return (
    <div id="canvas-container" className="w-full h-full relative">
      <Canvas
        ref={someRef}
        onCreated={({ gl }) => {
          gl.getContext().canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
          });
        }}
        dpr={[1, 1.5]}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Box />
          <ContactShadows
            position={[0, -2.5, 0]}
            scale={20}
            blur={2}
            far={4.5}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
          />
          <CameraRig />
        </Suspense>
      </Canvas>
      <LoaderAnimation />
    </div>
  );
};

export default LoginSide;

export function Box() {
  const { scene } = useGLTF("/macbook_laptop.glb");

  // Center and scale model
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.set(
      -80.14244938055162,
      -6.202078128586096,
      -24.250550354066164
    );
    scene.scale.set(12, 12, 12);
  }, [scene]);

  // Set up video texture on the screen mesh
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/video/LoginVideo.mp4";
    video.crossOrigin = "anonymous";
    video.filter = "saturate(4)";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.style.minHeight = "900vh !important";

    video.addEventListener("canplaythrough", () => video.play());

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.flipY = true; // usually false for GLTF UVs

    texture.repeat.set(2.2, 1.7);
    texture.center.set(0.5, 0.5);

    scene.traverse((child) => {
      if (child.isMesh && child.name === "Cube_Material003_0") {
        // child.scale.set(1, 1, 1.1); // Scale 150% in X and Y
        child.material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
          toneMapped: false,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

function CameraRig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (t < 2) {
      // Continuous animated orbiting
      const orbitRadius = 8;
      const speed = 3;

      const x = Math.sin(t * speed) * orbitRadius;
      const z = Math.cos(t * speed) * orbitRadius;
      const y = 2 + Math.sin(t * 0.1); // gentle vertical motion

      const targetPosition = v.set(x, y, z);
      state.camera.position.lerp(targetPosition, 0.05);
      state.camera.lookAt(0, 0, 0);
    } else {
      state.camera.position.lerp(
        v.set(Math.sin(t / 2.5), 5, 6 + Math.cos(t / 5) / 2),
        0.05
      );
      state.camera.lookAt(0, 0, 0);
    }
  });
}
