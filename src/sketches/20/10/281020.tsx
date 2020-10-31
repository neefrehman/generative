import React from "react";
import { MeshDistortMaterial, OrbitControls } from "drei";
import { Canvas } from "react-three-fiber";
import { makeFolder } from "use-tweaks";

import { useTweaksInDev } from "hooks/useTweaksInDev";

const S281020 = () => {
    const {
        detail,
        rotating,
        peakHeight,
        level,
        speed,
        turbulence,
    }: { [value: string]: number } & { rotating: boolean } = useTweaksInDev(
        "Mother Earth",
        {
            detail: { value: 4, min: 1, max: 10, step: 1 },
            rotating: true,
            ...makeFolder("Land", {
                peakHeight: { value: 0.45, min: 0, max: 1 },
            }),
            ...makeFolder("Sea", {
                speed: { value: 1.25, min: 0, max: 10 },
                turbulence: { value: 0.25, min: 0, max: 1 },
                level: { value: 1.04, min: 0, max: 1.5 },
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
            <pointLight intensity={1} position={[200, 200, 200]} />
            <pointLight intensity={0.4} position={[-200, -200, -200]} />

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

export default S281020;
