# 💷 Grand Bundling Plan (GBP)

Better dx, more modularity, more reusability, more declarative, p5 in instance mode, and maybe even typescript in more complex sketches.

Likely I'll need to use a framework like Gatsby, Next, Sapper, etc., and replace the custom router I've made with dynamic imports to load and run the sketches, or create my own bundler setup to manage this myself.

Next seems to be the front-runner here. Ideally i'll be using React so I can use `react-three-fiber`, and the dynamic routing would be great, as then my pages can just have a `[sketch].tsx` file:

## Desired (rough) structure:
```
src
|____components
| |____p5Wrapper.tsx
| |____ThreeWrapper.tsx
|____pages
| |____ _error.tsx
| |____index.tsx
| |____[sketch]
| | |____index.tsx
| | |____HomeButton.tsx
| | |____ToolTip.tsx
sketches
|____utils
| |____open-simplex-noise.js
| |____resize-handler.js
| |____circle-vertex-generator.js
| |____{...utils}
|____19
| |____{...months}
| |____10
| | |____161019
| | | |____bezier-generator.js
| | | |____index.js
| | |____181019.ts  // <-- Imports modules from npm
| | |____201019.ts
| | |____261019.js  // <-- Imports module fom ../../utils
| | |____271019
| | | |____index.js
| | | |____shader.frag
| | | |____shader.vert
| | |____281019
| | | |____index.ts
| | | |____open-simplex-noise.js
| | |____301019.js
|____20
| |____{...months}
```

## Page contents:

```JavaScript
// 161019.js <-- example p5 sketch

import React from 'react';
import * as p5 from 'p5';

import P5Wrapper from '../../../components/p5Wrapper';

import bezierGenerator from './bezier-generator';

const Sketch = p5 => {
    let xOff = 0;

    p5.setup = () => {
        p5.createCanvas(windowWidth, windowHeight);
        p5.background(20);
        p5.stroke(255, 18);
        p5.noFill();
    };

    p5.draw = () => {
        const x1 = 2 * width * p5.noise(xOff + 10) - width / 2;
        const y1 = 2 * height * p5.noise(xOff + 50) - height / 2;
        const x2 = 2 * width * p5.noise(xOff + 20) - width / 2;
        const y2 = 2 * height * p5.noise(xOff + 60) - height / 2;
        const x3 = 2 * width * p5.noise(xOff + 30) - width / 2;
        const y3 = 2 * height * p5.noise(xOff + 70) - height / 2;
        const x4 = 2 * width * p5.noise(xOff + 40) - width / 2;
        const y4 = 2 * height * p5.noise(xOff + 80) - height / 2;

        bezierGenerator(x1, y1, x2, y2, x3, y3, x4, y4);

        xOff += 0.002;

        if (frameCount % 2000 == 0) p5.background(20);
    };
};

export default <P5Wrapper sketch={sketch} />;
```


## References:

1. https://parceljs.org/ 
3. https://rollupjs.org/guide/en/
5. https://www.npmjs.com/package/webpack-glsl-loader
2. https://github.com/glslify/glslify
6. https://github.com/glslify/babel-plugin-glslify
5. https://github.com/onnovisser/gatsby-plugin-glslify
3. http://mattdesl.svbtle.com/glslify
1. https://github.com/and-who/react-p5-wrapper
1. https://github.com/madebywild/wild-next
2. https://web.dev/code-splitting-with-dynamic-imports-in-nextjs/
3. https://nextjs.org/learn/excel/lazy-loading-modules/lazy-loading
4. https://nextjs.org/docs#dynamic-import
5. https://nextjs.org/blog/next-9#dynamic-route-segments
6. https://github.com/zeit/next.js#dynamic-routing
7. https://webpack.js.org/plugins/split-chunks-plugin/
8. https://frontendmasters.com/courses/intermediate-react-v2/code-splitting-libraries-child-components/
