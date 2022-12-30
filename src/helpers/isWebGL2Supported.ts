/**
 * Detects browser WebGL2 support. Useful for providing fallback messgaes for sketches
 * 
 * @example
 * return isWebGL2Supported() ? (
        <SkecthComponent />
    ) : (
        <TextOverlay text="Your browser doesn't support WebGL2" timeout={false} />
    );
 */
export const isWebGL2Supported = (): boolean =>
  !!document.createElement("canvas").getContext("webgl2");
