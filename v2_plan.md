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

```JavaScript
// [Sketch]/index.js

import React from 'react';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import PageWrapper from '../../components/PageWrapper'

import HomeButton from './HomeButton'
import ToolTip from './ToolTip'

const Sketch = () => {
    const router = useRouter();
    const { sketchId } = router.query;
    const year = sketchId.substr(4, 2);
    const month = sketchId.substr(2, 2);
    const Sketch = dynamic(() => import(`../../sketches/${year}/${month}/${sketch}`))

    return (
        <PageWrapper>
            <Sketch />
            <HomeButton />
            <ToolTip />
        </PageWrapper>
    );
};

export default Sketch;
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


## Questions:
1. Is there a way to achieve this with ES6 Module syntax, vanilla dynamic imports and no bundler? (probably won't work with glsl). I'm not too fussed about supporting older browser here so might be worth looking into.

1. ~~Does Next support dynamic routes only on ZEIT Now, or can they run on Netlify too? From the announcement post it looks like the fetch always happens inside `getInitialProps()`, which suggests it needs to be run on Now with SSR. Wonder if it can work with `next export`, so that I can deploy to Netlify?~~

    **Update**: just did some research on the [Next docs](https://github.com/zeit/next.js#dynamic-routing) and found the following useful info (second one is most pertinent): 

    >**Note**: Predefined routes take precedence over dynamic routes. For example, if you have pages/post/[pid].js and pages/post/create.js, the route /post/create will be matched by pages/post/create.js instead of the dynamic route ([pid]).

    > **Note**: Pages that are statically optimized by [automatic static optimization](https://github.com/zeit/next.js#automatic-static-optimization) will be **hydrated without their route parameters provided (query will be empty, i.e. {}). After hydration, Next.js will trigger an update to your application to provide the route parameters in the query object.** If your application cannot tolerate this behavior, you can opt-out of static optimization by capturing the query parameter in getInitialProps.

    >**Note**: If deploying to ZEIT Now dynamic routes will work out-of-the-box. You do not need to configure custom routes in a now.json file.

2. ~~Also, does dynamic importing support template literals?~~ Yes. But will it bundle all of the sketches into the main bundle and then just eval the correct one? [[1](https://github.com/zeit/next.js/issues/6032#issuecomment-453497214), [2](https://github.com/zeit/next.js/issues/4100#issuecomment-380943474)] Or will it create separate bundles that include each sketch? [[1](https://github.com/zeit/next.js/issues/2514#issuecomment-319605193)]. Neither are good outcomes tbh, so maybe just running a fetch of the sketch and somehow running that inside a component will be best?

1. Need to learn more about unmounting components and memory here. If all the sketch logic is scoped to the component then unmounting should clear it all from memory. Do I still need to call p5's `remove()` function? Perf could go down the shitter fast with these sketches so I need to be clear on that.

3. How can I get effective code-splitting? Will dynamic imports allow for sharing instances of p5 or r3f into the main bundle, so other sketches can use them laterwithout reimporting/re-bundling them all for each sketch?

1. After putting in all this thinking to create an SPA where I basically just need sketches to run only on their page, I'm left wondering if I should just use a bundler to also create separate html pages for each sketch. I'll then be able to use whatever the hell library I like to render sketches, right? Are there any reasons I actually need this site to be an SPA? 🤔 🤔 🤔 I first made it an SPA to avoid writing out so many html pages, but if I'm already going to implement a bundler... 
    
    Pros & cons of going vanilla and generating a html file per sketch:

    * Pros:
        * Fully vanilla sketches to write and share
        * No framework to maneuvre around
        * No framework to load
        * More beginner friendly for contributors or people who want to fork for own purposes
    * Cons:
        * Build times might get very long after a while still
        * I wouldn't be able to pass props and state to sketches if I need to (which I probably won't tbh)
        * Wouldn't be able to do any fancy transitions or loading states. Suspense would be great here.
        * code-splitting, again! Would the sketches each be bundled with the libraries? I'd need the libs to be bundled separately so they can be cached and shared. Different html files makes this tricky.
        * It's fun to learn some of the complex stuff!