import React from "react";
import { MeshDistortMaterial, OrbitControls } from "drei";
import { Canvas } from "react-three-fiber";
import { makeFolder, useTweaks } from "use-tweaks";

const DPlanetNoise = () => {
    const { detail, rotating, peakHeight, level, speed, turbulence } = useTweaks(
        "Mother Earth",
        {
            detail: { value: 2, min: 1, max: 10, step: 1 },
            rotating: true,
            ...makeFolder("Land", { peakHeight: { value: 0.35, min: 0, max: 1 } }),
            ...makeFolder("Sea", {
                speed: { value: 1, min: 0, max: 10 },
                turbulence: { value: 0.2, min: 0, max: 1 },
                level: { value: 1, min: 0, max: 1.5 },
            }),
        }
    );

    return (
        <Canvas
            style={{
                backgroundColor: "black",
                height: "100vh",
                width: "100vw",
            }}
        >
            <OrbitControls
                enableZoom={false}
                autoRotate={rotating}
                autoRotateSpeed={1}
            />
            <ambientLight intensity={0.5} />
            <pointLight intensity={1} position={[0, 200, 0]} />
            <pointLight intensity={1} position={[100, 200, 100]} />
            <pointLight intensity={0.5} position={[-100, -200, -100]} />

            <mesh>
                <icosahedronGeometry args={[2, detail]} />
                <MeshDistortMaterial
                    distort={peakHeight}
                    radius={1}
                    speed={0}
                    color="#34722A"
                />
            </mesh>
            <mesh>
                <icosahedronGeometry args={[2, detail]} />
                <MeshDistortMaterial
                    distort={turbulence}
                    radius={level}
                    color="#23537d"
                    speed={speed}
                />
            </mesh>
        </Canvas>
    );
};

export default DPlanetNoise;
