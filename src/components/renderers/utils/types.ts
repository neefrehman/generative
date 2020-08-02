import { Vector } from "Utils/math";

/**
 * Props to be recieved by the sketch.
 */
export interface DrawProps {
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
