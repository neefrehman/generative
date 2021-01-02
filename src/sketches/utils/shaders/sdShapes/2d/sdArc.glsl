// 2d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

precision highp float;

float sdArc(vec2 p, vec2 sca, vec2 scb, float ra, float rb) {
    p *= mat2(sca.x, sca.y, -sca.y, sca.x);
    p.x = abs(p.x);
    float k = (scb.y * p.x > scb.x * p.y) ? dot(p.xy, scb) : length(p.xy);

    return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

// clang-format off
#pragma glslify: export(sdArc)