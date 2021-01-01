// Smooth minimum functions for GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/smin/smin.htm

precision highp float;

float smin(float a, float b, float k) {
    a = pow(a, k);
    b = pow(b, k);
    return pow((a * b) / (a + b), 1.0 / k);
}

// clang-format off
#pragma glslify: export(smin)