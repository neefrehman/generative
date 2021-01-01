// Smooth minimum functions for GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/smin/smin.htm

precision highp float;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// clang-format off
#pragma glslify: export(smin)