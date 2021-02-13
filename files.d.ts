declare module "*.obj";
declare module "*.gltf";
declare module "*.glsl";
declare module "*.svg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.jpg";

declare module "postprocessing";
declare module "glslify" {
    function glsl(shader?: TemplateStringsArray): string;
    export = glsl;
}
