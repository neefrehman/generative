precision highp float;

float randomFloat(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// clang-format off
#pragma glslify: export(randomFloat)