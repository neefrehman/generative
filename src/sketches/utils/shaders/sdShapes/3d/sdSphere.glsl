// 3d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

precision highp float;

float sdSphere(vec3 p, float r) { return length(p) - r; }

// clang-format off
#pragma glslify: export(sdSphere)