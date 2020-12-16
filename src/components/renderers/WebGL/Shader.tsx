import React, { useRef, useEffect } from "react";
import glsl from "glslify";

import { useAnimationFrame } from "hooks/useAnimationFrame";

import type { UniformDict, UniformType } from "Utils/shaders";

import type { RendererProps, RendererSettings, DrawProps, DrawFn } from "../types";

import {
    compileShader,
    createAttribute,
    getUniformLocation,
    setUniform,
} from "./helpers";
import type { GLContext } from "./helpers";

/**
 * A canvas component for running fragment shaders. Handles rendering and cleanup.
 */
export const ShaderRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
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
                frameCount: animationProps.frameCount,
                elapsedTime: animationProps.elapsedTime,
                fps: animationProps.fps,
                startAnimation,
                stopAnimation,
                isPlaying: animationProps.isPlaying,
                mouseHasEntered: animationProps.mouseHasEntered,
                mousePosition: animationProps.mousePosition,
                mouseIsDown: animationProps.mouseIsDown,
                mouseIsIdle: animationProps.mouseIsIdle,
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
            vUv = uv;
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
            uniforms: uniformsRef.current, // TODO: find way to extract types of uniform input and add safety to props output?
            width,
            height,
            aspect: width / height,
            mouseHasEntered: false,
            mousePosition: [0, 0],
        };

        const sketchObject = setupSketch(initialSketchProps);

        // TODO: defines?
        const uniforms = sketchObject.uniforms;
        const vert = sketchObject.vert ?? defaultVert;
        const frag = sketchObject.frag ?? defaultFrag;
        const onFrame = sketchObject.onFrame;

        const vertexShader = compileShader(vert, gl.VERTEX_SHADER, gl);
        const fragmentShader = compileShader(frag, gl.FRAGMENT_SHADER, gl);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const createdUniforms: {
            key: string;
            handle: WebGLUniformLocation;
            type: UniformType;
        }[] = Object.entries(uniforms).reduce((acc, [key, { value, type }]) => {
            const handle = getUniformLocation(key, program, gl);
            setUniform(handle, value, type, gl);
            return [...acc, { key, handle, type }]; // an array we can use later to update the uniforms
        }, []);

        /* prettier-ignore */
        const vertexData = new Float32Array([
            -1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
             1.0, -1.0,
        ]);
        const positionAttr = createAttribute("position", vertexData, program, gl);

        /* prettier-ignore */
        const uvData = new Float32Array([
            0.0,  0.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0,
        ]);
        const uvAttr = createAttribute("uv", uvData, program, gl);

        drawProps.current = initialSketchProps;
        uniformsRef.current = uniforms;

        drawFunction.current = currentDrawProps => {
            onFrame?.(currentDrawProps);

            createdUniforms.forEach(({ key, handle, type }) => {
                const newValue = uniformsRef.current[key].value;
                setUniform(handle, newValue, type, gl);
            });

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        return () => {
            gl.deleteBuffer(positionAttr.buffer);
            gl.disableVertexAttribArray(positionAttr.handle);
            gl.deleteBuffer(uvAttr.buffer);
            gl.disableVertexAttribArray(uvAttr.handle);
        };
    }, [setupSketch, settings, width, height, defaultVert, defaultFrag]);

    useEffect(
        () => () => {
            const gl = drawProps.current.gl;
            gl.canvas.width = 1;
            gl.canvas.height = 1;
            gl.getExtension("WEBGL_lose_context").loseContext();
        },
        []
    );

    return (
        <>
            <canvas
                ref={canvasElement}
                width={width}
                height={height}
                className={className}
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
    /** The WebGL context of the sketch */
    gl: GLContext;
    /** The shader uniforms that you created in the sketches retiurn object. Update these by changing their `value` property */
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
    /**
     * The uniforms to interface with the shaders. The renderer will autmatically detect their gl type (floats must contain a decimal)
     * If auto-detection doesn't work, add `type: "1f"` to the uniform, alongside `value`
     */
    uniforms?: UniformDict;
    /** The vertex shader as a glsl string */
    vert?: string;
    /** The fragment shader as a glsl string */
    frag?: string;
    /** A callback to be run on every frame of the sketch. Here you can update vairables, state, and uniforms */
    onFrame?: ShaderDrawFn;
};

/**
 * The draw function returned by `ShaderSetupFn`, with access to `ShaderDrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type ShaderDrawFn = DrawFn<ShaderDrawProps>;
