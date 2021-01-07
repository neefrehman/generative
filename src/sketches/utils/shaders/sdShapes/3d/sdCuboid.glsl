// 3d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

precision highp float;

float sdCube(vec3 p, vec3 dimensions) {
    vec3 q = abs(p) - dimensions;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// clang-format off
#pragma glslify: export(sdCube)