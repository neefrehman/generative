export const isWebGL2Supported = (): boolean =>
    !!document.createElement("canvas").getContext("webgl2");
