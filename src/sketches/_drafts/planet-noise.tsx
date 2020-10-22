import React from "react";
import { MeshDistortMaterial, OrbitControls } from "drei";
import { Canvas } from "react-three-fiber";

const DPlanetNoise = () => {
    const POLY_AMOUNT = 6;

    return (
        <Canvas
            style={{
                backgroundColor: "black",
                height: "100vh",
                width: "100vw",
            }}
        >
            <ambientLight intensity={0.5} />
            <pointLight intensity={1} position={[0, 200, 0]} />
            <pointLight intensity={1} position={[100, 200, 100]} />
            <pointLight intensity={0.5} position={[-100, -200, -100]} />
            <OrbitControls enableZoom={false} />
            <mesh>
                <sphereBufferGeometry args={[2, POLY_AMOUNT, POLY_AMOUNT]} />
                <MeshDistortMaterial
                    distort={0.5}
                    radius={0.95}
                    speed={0}
                    color="#34722A"
                />
            </mesh>
            <mesh>
                <sphereBufferGeometry args={[2, POLY_AMOUNT, POLY_AMOUNT]} />
                <MeshDistortMaterial distort={0.2} radius={1} color="#23537d" />
            </mesh>
        </Canvas>
    );
};

export default DPlanetNoise;
