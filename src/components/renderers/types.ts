import type { CSSProperties, ReactNode } from "react";

import type { OnFrameProps } from "hooks/useAnimationFrame";

export interface RendererProps<SketchFunction, SketchSettings = RendererSettings> {
    /** The sketch function to be run */
    sketch: SketchFunction;
    /** The setting for the sketch */
    settings?: SketchSettings;
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
 * Props to be recieved by the sketch's setup function
 */
export type SetupProps = {
    /** The width of the sketch - maps to dimensions[0] from the sketch settings */
    width?: number;
    /** The width of the sketch - maps to dimensions[1] from the sketch settings */
    height?: number;
    /** The aspect ratio of the sketch */
    aspect?: number;
};

/**
 * Props to be recieved by the sketch's draw function
 */
export type DrawProps = SetupProps & OnFrameProps;

/**
 * The setup function to be passed into the React component, with access to `DrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type SetupFn<Props extends SetupProps, DrawFn> = (props?: Props) => DrawFn;

/**
 * The draw function returned by `SetupFn`, with access to `DrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type DrawFn<Props extends DrawProps> = (props?: Props) => void;
