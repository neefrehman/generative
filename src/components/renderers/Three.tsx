import React, { useRef, useEffect } from "react";
import * as THREE from "three";

import { useAnimationFrame } from "hooks/useAnimationFrame";

import type {
    RendererProps,
    RendererSettings,
    DrawProps,
    SetupFn,
    DrawFn,
} from "./types";

/**
 * A wrapper component for running three.js sketches. Handles rendering and cleanup.
 */
export const ThreeRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children,
}: ThreeRendererProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawProps = useRef<ThreeDrawProps>({} as ThreeDrawProps);
    const drawFunction = useRef<ThreeDrawFn>();

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {},
    } = settings;

    const [width, height] = dimensions;
    const { fps: throttledFps, delay, endAfter } = animationSettings;

    const { startAnimation, stopAnimation } = useAnimationFrame(
        animationProps =>
            drawFunction.current?.({
                ...drawProps.current,
                ...animationProps,
                startAnimation,
                stopAnimation,
            }),
        {
            willPlay: isAnimated,
            fps: throttledFps,
            delay,
            endAfter,
            domElementRef: canvasRef,
        }
    );

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasRef.current,
        });
        const camera =
            settings.camera ??
            new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        const initialSketchProps: ThreeDrawProps = {
            camera,
            scene,
            renderer,
            canvas: canvasRef.current,
            width,
            height,
            aspect: width / height,
            mouseHasEntered: false,
            mousePosition: [0, 0],
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = (props: ThreeDrawProps) => {
            drawSketch(props);
            renderer.render(scene, camera);
        };

        return () => {
            scene.children.forEach(child => scene.remove(child));
            scene.clear();
            scene.remove();
            renderer.clear();
            renderer.dispose();
        };
    }, [setupSketch, settings, width, height]);

    return (
        <>
            <canvas ref={canvasRef} className={className} style={style} />
            {children}
        </>
    );
};

// <- TYPES ->

export type ThreeRendererProps = RendererProps<
    ThreeSetupFn,
    ThreeRendererSettings
>;

/**
 * Settings for the Three sketch
 */
export type ThreeRendererSettings = RendererSettings & {
    /** The camera */
    camera?: THREE.Camera;
};

/**
 * Props to be recieved by the Three sketch.
 */
export type ThreeDrawProps = {
    /** The camera */
    camera: THREE.Camera;
    /** Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. */
    scene: THREE.Scene;
    /** The WebGL renderer for the scene */
    renderer: THREE.WebGLRenderer;
    /** The `canvas` DOM element */
    canvas: HTMLCanvasElement;
} & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `ThreeDrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type ThreeSetupFn = SetupFn<ThreeDrawProps, ThreeDrawFn>;

/**
 * The draw function returned by `ThreeSetupFn`, with access to `ThreeDrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type ThreeDrawFn = DrawFn<ThreeDrawProps>;
