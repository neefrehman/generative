// 3d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

precision highp float;

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// clang-format off
#pragma glslify: export(sdTorus)