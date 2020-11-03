// Adapted from Jamie Wong's post on glsl metaballs: http://jamie-wong.com/2016/07/06/metaballs-and-webgl/

import React, { useRef, useEffect } from "react";
import glsl from "glslify";

import { useAnimationFrame } from "hooks/useAnimationFrame";

import {
    compileShader,
    getAttributeLocation,
    getUniformLocation,
    GL,
    setUniform,
    UniformDict,
} from "Utils/shaders";

import type { RendererProps, RendererSettings, DrawProps } from "./types";

/**
 * A canvas component for running fragment shaders. Handles rendering and cleanup.
 */
export const ShaderRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children,
}: ShaderRendererProps) => {
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const drawProps = useRef<ShaderDrawProps>({} as ShaderDrawProps);
    const drawFunction = useRef<ShaderDrawFn>();
    const uniformsRef = useRef<UniformDict>({});

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {},
    } = settings;

    const [width, height] = dimensions;
    const { fps: throttledFps, delay, endAfter } = animationSettings;

    const { startAnimation, stopAnimation } = useAnimationFrame(
        animationProps => {
            drawFunction.current?.({
                ...drawProps.current,
                uniforms: uniformsRef.current,
                frame: animationProps.frameCount,
                time: animationProps.elapsedTime,
                fps: animationProps.fps,
                startAnimation,
                stopAnimation,
                isPlaying: animationProps.isPlaying,
                mouseHasEntered: animationProps.mouseHasEntered,
                mousePosition: animationProps.mousePosition,
            });
        },
        {
            willPlay: isAnimated,
            fps: throttledFps,
            delay,
            endAfter,
            domElementRef: canvasElement,
        }
    );

    const defaultVert = glsl`
        precision highp float;
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
            vUv = position;
            gl_Position = vec4(position, 0.0, 1.0);    
        }
    `;

    const defaultFrag = glsl`
        void main() {
            gl_FragColor = vec4(1.0);
        }
    `;

    useEffect(() => {
        const canvas = canvasElement.current;
        const gl = canvas.getContext("webgl");

        const initialSketchProps: ShaderDrawProps = {
            gl,
            uniforms: uniformsRef.current,
            width,
            height,
            aspect: width / height,
            mouseHasEntered: false,
            mousePosition: [0, 0],
        };

        const sketchObject = setupSketch(initialSketchProps);

        const vert = sketchObject.vert ?? defaultVert;
        const frag = sketchObject.frag ?? defaultFrag;
        const uniforms = sketchObject.uniforms;
        const onFrame = sketchObject.onFrame;

        const vertexShader = compileShader(vert, gl.VERTEX_SHADER, gl);
        const fragmentShader = compileShader(frag, gl.FRAGMENT_SHADER, gl);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const createdUniforms = Object.entries(uniforms).reduce(
            (acc, [key, { value, type }]) => {
                const uniformHandle = getUniformLocation(key, program, gl);
                setUniform(uniformHandle, value, type, gl);
                // Return an array that we can use later to update uniforms
                return [...acc, { key, uniformHandle, type }];
            },
            []
        );

        // prettier-ignore
        const vertexData = new Float32Array([
            -1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
             1.0, -1.0,
        ]);

        const vertexDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        const positionHandle = getAttributeLocation("position", program, gl);
        gl.enableVertexAttribArray(positionHandle);
        gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

        // TODO: uv attributes
        // const uvHandle = getAttributeLocation(program, gl, "uv");
        // gl.enableVertexAttribArray(uvHandle);
        // gl.vertexAttribPointer(uvHandle, 2, gl.FLOAT, false, 2 * 4, 0);

        drawProps.current = initialSketchProps;
        uniformsRef.current = uniforms;

        drawFunction.current = currentDrawProps => {
            onFrame?.(currentDrawProps);

            createdUniforms.forEach(({ key, uniformHandle, type }) => {
                const newValue = uniformsRef.current[key].value;
                setUniform(uniformHandle, newValue, type, gl);
            });

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        return () => {
            gl.deleteBuffer(vertexDataBuffer);
            gl.disableVertexAttribArray(positionHandle);
        };
    }, [setupSketch, settings, width, height]);

    return (
        <>
            <canvas
                ref={canvasElement}
                width={width}
                height={height}
                className={className}
                style={style}
            />
            {children}
        </>
    );
};

// <- TYPES ->

export type ShaderRendererProps = RendererProps<ShaderSetupFn>;

/**
 * Settings for the sketch
 */
export type { RendererSettings as ShaderRendererSettings };

/**
 * Props to be recieved by the sketch.
 */
export type ShaderDrawProps = {
    gl: GL;
    uniforms?: UniformDict;
} & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `ShaderDrawProps`.
 *
 * The contents of this function should contain all sketch state, and can return shaders, uniforms,
 * and an onFrame callback function
 */
export type ShaderSetupFn = (
    props?: ShaderDrawProps
) => {
    vert?: string;
    frag?: string;
    uniforms?: UniformDict;
    onFrame?: ShaderDrawFn;
};

/**
 * The draw function returned by `ShaderSetupFn`, with access to `ShaderDrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type ShaderDrawFn = (props?: ShaderDrawProps) => void;
