import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import type { CSSProperties } from "linaria/react";

import type { Vector } from "Utils/math";
import { useAnimationFrame } from "Utils/useAnimationFrame";

/**
 * A wrapper component for running three.js sketches. Handles rendering and cleanup.
 */
export const ThreeRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children
}: ThreeRendererProps) => {
    const wrapperElement = useRef<HTMLDivElement>(null);
    const drawProps = useRef<ThreeDrawProps>({});
    const drawFunction = useRef<ThreeDrawFn>();

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {}
    } = settings;

    const [width, height] = dimensions;

    const { fps: throttledFps, delay, endAfter } = animationSettings;
    const {
        frameCount,
        elapsedTime,
        fps,
        startAnimation,
        stopAnimation,
        isPlaying,
        mouseHasEntered,
        mousePosition
    } = useAnimationFrame({
        willPlay: isAnimated ?? false,
        onFrame: () =>
            drawFunction.current?.({
                ...drawProps.current,
                frame: frameCount.current,
                time: elapsedTime.current,
                fps: fps.current,
                startAnimation,
                stopAnimation,
                isPlaying: isPlaying.current,
                mouseHasEntered: mouseHasEntered.current,
                mousePosition: mousePosition.current
            }),
        fps: throttledFps,
        delay,
        endAfter,
        domElementRef: wrapperElement
    });

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        wrapperElement.current.appendChild(renderer.domElement);

        const initialSketchProps = {
            scene,
            renderer,
            width,
            height,
            mouseHasEntered: false,
            mousePosition: [0, 0] as Vector<2>
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = drawSketch;

        drawSketch(initialSketchProps);

        return () => {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            scene.dispose();
        };
    }, [setupSketch, settings]);

    return (
        <>
            <div ref={wrapperElement} className={className} style={style} />
            {children}
        </>
    );
};

/**
 * React props for the ThreeRenderer component
 */
interface ThreeRendererProps {
    /** The sketch function to be run */
    sketch: ThreeSetupFn;
    /** The setting for the sketch function */
    settings?: ThreeRendererSettings;

    autoResizeToWindow?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * Settings for the Three sketch
 */
export interface ThreeRendererSettings {
    /** The dimensions for the sketch, in pixels. Defaults to [windowWidth, windowHeight] */
    dimensions?: [number, number];

    /** Used to set if the sketch will be animated, defaults to true */
    isAnimated?: boolean;
    /** Animation setting for the sketch */
    animationSettings?: {
        /** The desired fps to throttle the sketch to - defaults to 60 */
        fps?: number;
        /** A delay (in ms) after which the animation will start */
        delay?: number;
        /** A time (in ms) after which the animation will be stopped */
        endAfter?: number;
    };
}

interface ThreeDrawProps {
    /** Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. */
    scene?: THREE.Scene;
    /** The WebGL renderer for the scene */
    renderer?: THREE.WebGLRenderer;

    /** The width of the sketch - maps to dimensions[0] from the sketch settings */
    width?: number;
    /** The width of the sketch - maps to dimensions[1] from the sketch settings */
    height?: number;

    /** The current frames of the animation */
    frame?: number;
    /** The current elapsed time of the animation in ms */
    time?: number;
    /** The current fps of the animation (averaged over the last 10 frames) */
    fps?: number;
    /** A function that will stop the animation when called */
    stopAnimation?: () => void;
    /** A function that will restart the animation when called */
    startAnimation?: () => void;
    /** True if the animation is currenty running, otherwise false */
    isPlaying?: boolean;

    /** A boolean that is true if the mouse has interacted with the animation */
    mouseHasEntered?: boolean;
    /** A vector of current position of the mouse over the canvas - [mouseX, mouseY] */
    mousePosition?: Vector<2>;

    /** A callback that will be run every time the mouse moves across the canvas */
    onMouseMove?: () => void;
    /** A callback that will be run every time the user clicks on the canvas */
    onClick?: () => void;
}

/**
 * The setup function to be passed into the React component, with access to `ThreeDrawProps`.
 *
 * Use the contents of this function should contain all sketch state, with the drawing happening
 * inside it's return function.
 */
export type ThreeSetupFn = (props?: ThreeDrawProps) => ThreeDrawFn;

/**
 * The draw function returned by `ThreeSetupFn`, with access to `ThreeDrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type ThreeDrawFn = (props?: ThreeDrawProps) => void;
