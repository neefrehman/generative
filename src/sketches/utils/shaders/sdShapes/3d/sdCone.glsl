// 3d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

precision highp float;

float sdCone(vec3 p, vec2 c, float h) {
    float q = length(p.xz);
    return max(dot(c.xy, vec2(q, p.y)), -h - p.y);
}

// clang-format off
#pragma glslify: export(sdCone)