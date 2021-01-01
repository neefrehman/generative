// Smooth minimum functions for GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/smin/smin.htm

precision highp float;

float smin(float a, float b, float k) {
    float res = exp2(-k * a) + exp2(-k * b);
    return -log2(res) / k;
}

// clang-format off
#pragma glslify: export(smin)