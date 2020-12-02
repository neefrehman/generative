import type { CSSProperties } from "linaria/react";
import type { ReactNode } from "react";

import type { OnFrameProps } from "hooks/useAnimationFrame";

export interface RendererProps<SketchFunction> {
    /** The sketch function to be run */
    sketch: SketchFunction;
    /** The setting for the sketch */
    settings?: RendererSettings;

    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * Settings for the sketch
 */
export interface RendererSettings {
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

/**
 * Props to be recieved by the sketch.
 */
export type DrawProps = {
    /** The width of the sketch - maps to dimensions[0] from the sketch settings */
    width?: number;
    /** The width of the sketch - maps to dimensions[1] from the sketch settings */
    height?: number;
    /** The aspect ratio of the sketch */
    aspect?: number;
} & OnFrameProps;

/**
 * The setup function to be passed into the React component, with access to `DrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type SetupFn<DrawProps_, DrawFn> = (props?: DrawProps_) => DrawFn;

/**
 * The draw function returned by `SetupFn`, with access to `DrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type DrawFn<DrawProps_> = (props?: DrawProps_) => void;
