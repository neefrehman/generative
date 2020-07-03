import React, { useState } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { useSpring } from "react-spring";
import { OrbitControls } from "drei";

import { Stars } from "LibUtils/r3f";
import { lerp } from "Utils/math";

const initialCameraZ = 20000;

const Controls = () => {
    const { gl, camera } = useThree();
    const [rotationSpeed, setRotationSpeed] = useState(0);
    const [zoomIsFinished, setZoomIsFinished] = useState(false);

    // Will be deprecated in v9 https://github.com/react-spring/react-three-fiber/discussions/505
    useSpring({
        from: {
            z: initialCameraZ
        },
        z: 20,
        config: {
            mass: 5.2,
            tension: 270,
            friction: 150
        },
        onFrame: ({ z }) => {
            camera.position.z = z;
        },
        onRest: () => setZoomIsFinished(true)
    });

    useFrame(() => {
        if (rotationSpeed < 0.25) {
            setRotationSpeed(
                lerp(rotationSpeed, 0.255, zoomIsFinished ? 0.0025 : 0.0005)
            );
        }
    });

    return (
        <OrbitControls
            target={[0, 0, 0]}
            args={[camera, gl.domElement]}
            autoRotate
            autoRotateSpeed={rotationSpeed}
            enableZoom={false}
        />
    );
};

const S220620 = () => (
    <Canvas
        camera={{ position: [0, 0, initialCameraZ] }}
        style={{
            background: "#061923",
            height: "100vh",
            width: "100vw"
        }}
        shadowMap
    >
        <Stars count={1000} />
        <Controls />
    </Canvas>
);

export default S220620;
