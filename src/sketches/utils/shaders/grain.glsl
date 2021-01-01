// https://simonharris.co/making-a-noise-film-grain-post-processing-effect-from-scratch-in-threejs/

precision highp float;

vec2 K1 = vec2(23.14069263277926, // e^pi (Gelfond's constant)
               2.665144142690225  // 2^sqrt(2) (Gelfond–Schneider constant)
);

float filmGrain(vec2 pos) { return fract(cos(dot(pos, K1)) * 12345.6789); }

// clang-format off
#pragma glslify: export(filmGrain)