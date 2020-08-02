import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import type { CSSProperties } from "linaria/react";

import type { Vector } from "Utils/math";
import { useAnimationFrame } from "Utils/useAnimationFrame";

import type { DrawProps, RendererSettings } from "./utils/types";

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
    settings?: RendererSettings;

    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

export type { RendererSettings as ThreeRendererSettings };

type ThreeDrawProps = {
    /** Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. */
    scene?: THREE.Scene;
    /** The WebGL renderer for the scene */
    renderer?: THREE.WebGLRenderer;
} & DrawProps;

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
