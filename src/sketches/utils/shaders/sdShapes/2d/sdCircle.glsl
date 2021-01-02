// 2d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

precision highp float;

float sdCircle(vec2 p, float r) { return length(p) - r; }

// clang-format off
#pragma glslify: export(sdCircle)