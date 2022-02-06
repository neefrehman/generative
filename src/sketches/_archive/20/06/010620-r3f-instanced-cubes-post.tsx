import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, usePlane, useSphere, useBox } from "@react-three/cannon";
import { BlendFunction, KernelSize } from "postprocessing";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";

const InvisibleBorders = () => {
    const { viewport } = useThree();

    const Plane = ({ ...props }): null => {
        usePlane(() => ({ ...props }));
        return null;
    };

    return (
        <>
            <Plane
                position={[0, -viewport.height / 2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            />
            <Plane
                position={[-viewport.width / 2 - 1, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Plane
                position={[viewport.width / 2 + 1, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
            />
            <Plane position={[0, 0, 0]} rotation={[0, 0, 0]} />
            <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} />
        </>
    );
};

const InvisibleMouseSphere = () => {
    const { viewport } = useThree();
    const [, api] = useSphere(() => ({
        type: "Kinematic",
        args: [window.innerWidth > 600 ? 7 : 4],
    }));

    return useFrame(state =>
        api.position.set(
            (state.mouse.x * viewport.width) / 2,
            (state.mouse.y * viewport.height) / 2,
            7
        )
    );
};

const InstancedBoxes = () => {
    const { viewport } = useThree();
    const boxCount = window.innerWidth > 600 ? 200 : 60;
    const boxRadius = 1.5;

    const [ref] = useBox(() => ({
        mass: 100,
        position: [4 - Math.random() * 8, viewport.height, 0],
        args: [boxRadius, boxRadius, boxRadius],
    }));

    return (
        <instancedMesh
            ref={ref}
            castShadow
            receiveShadow
            args={[undefined, undefined, boxCount]}
        >
            <boxBufferGeometry args={[boxRadius, boxRadius, boxRadius]} />
            <meshLambertMaterial color="#ff7b00" />
        </instancedMesh>
    );
};

const Post = () => (
    <Suspense fallback={null}>
        <EffectComposer>
            <Bloom
                blendFunction={BlendFunction.SCREEN}
                kernelSize={KernelSize.LARGE}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.0}
                height={300}
            />
            <SSAO
                blendFunction={BlendFunction.MULTIPLY}
                rings={4}
                distanceThreshold={0.4}
                distanceFalloff={0.5}
                rangeThreshold={0.5}
                rangeFalloff={0.01}
                bias={0.5}
                samples={21}
                radius={7}
                luminanceInfluence={0.6}
            />
        </EffectComposer>
    </Suspense>
);

const S280720 = () => (
    <Canvas
        gl={{
            powerPreference: "high-performance",
            stencil: false,
            depth: false,
            alpha: false,
            antialias: false,
        }}
        camera={{ position: [0, 0, 20], fov: 50, near: 17, far: 40 }}
        style={{ height: "100vh", width: "100vw" }}
    >
        <fog attach="fog" args={["red", 25, 40]} />
        <color attach="background" args={["#ffdd41"]} />
        <ambientLight intensity={2} />
        <directionalLight
            position={[50, 50, 25]}
            intensity={2}
            castShadow
            shadow-mapSize-width={64}
            shadow-mapSize-height={64}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Physics
            gravity={[0, -30, 0]}
            defaultContactMaterial={{ restitution: 0.5 }}
        >
            <group position={[0, 0, -10]}>
                <InvisibleBorders />
                <InvisibleMouseSphere />
                <InstancedBoxes />
            </group>
        </Physics>
        <Post />
    </Canvas>
);

export default S280720;
