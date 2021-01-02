// 2d distance function shapes in GLSL, sourced from Iñigo Quílez's post:
// https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

precision highp float;

float sdPolygon(vec2[N] v, vec2 p) {
    float d = dot(p - v[0], p - v[0]);
    float s = 1.0;

    for (int i = 0, j = N - 1; i < N; j = i, i++) {
        // get distance
        vec2 e = v[j] - v[i];
        vec2 w = p - v[i];
        vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
        d = min(d, dot(b, b));

        // winding number from http://geomalgorithms.com/a03-_inclusion.html
        bvec3 c = bvec3(p.y >= v[i].y, p.y<v[j].y, e.x * w.y> e.y * w.x);

        if (all(c) || all(not(c)))
            s *= -1.0;
    }
    return s * sqrt(d);
}

// clang-format off
#pragma glslify: export(sdPolygon)