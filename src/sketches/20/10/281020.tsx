import React from "react";
import { MeshDistortMaterial, OrbitControls } from "drei";
import { Canvas } from "react-three-fiber";

const S281020 = () => {
    const detail = 4;
    const rotating = true;
    const peakHeight = 0.45;
    const level = 1.04;
    const speed = 1.25;
    const turbulence = 0.25;

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
                    color="#3d7d2A"
                    stencilMask={null}
                />
            </mesh>
            <mesh>
                <icosahedronGeometry args={[2, detail]} />
                <MeshDistortMaterial
                    distort={turbulence}
                    radius={level}
                    color="#23537d"
                    speed={speed}
                    stencilMask={null}
                />
            </mesh>
        </Canvas>
    );
};

export default S281020;
