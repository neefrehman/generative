# 💷 Grand Bundling Plan (GBP)

Better dx, more modularity, more reusability, more declarative, p5 in instance mode, and maybe even typescript in more complex sketches.

## STEP 1: Enable bundling for sketches directory

To allow for importing helper functions and classes, from npm or ones that I make (module syntax only in /skethces). Also allows for importing glsl files.

### Input:
```
sketches
|____helpers
| |____open-simplex-noise.js
| |____resize-handler.js
| |____circle-vertex-generator.js
| |____[...other-functions]
|____[...other-years]
|____19
| |____[...other-months]
| |____10
| | |____161019
| | | |____blob-class.js
| | | |____index.js
| | | |____photo.jpeg
| | | |____shader.glsl
| | |____181019.js  // <-- Imports modules from npm
| | |____201019.js
| | |____261019.js  // <-- Imports module fom ../../helpers
| | |____271019
| | | |____index.js
| | | |____shader.frag
| | | |____shader.vert
| | |____281019
| | | |____index.js
| | | |____open-simplex-noise.js
| | |____301019.js
```

### Desired Output:
```
sketches
|____output // or dist, or whatever tbh
| |____[...other-years]
| |____19
| | |____[...other-months]
| | |____10
| | | |____161019.js
| | | |____181019.js
| | | |____201019.js
| | | |____261019.js
| | | |____271019.js
| | | |____281019.js
| | | |____301019.js
```

Only change needed in `router.js` is in `goToSketch()`

from: `const pathToSketch = sketches/${year}/${month}/${sketch}.js;`

to: `const pathToSketch = sketches/output/${year}/${month}/${sketch}.js;`

#### References:

1. https://parceljs.org/   // <-- easy to achieve bundling, but what about glsl?
3. https://rollupjs.org/guide/en/
5. https://www.npmjs.com/package/webpack-glsl-loader
2. https://github.com/glslify/glslify
3. http://mattdesl.svbtle.com/glslify


#### Questions:
1. Is there a way to do this with ES6 Module syntax and no bundler? I'm not too fussed about supporting older browser here so might be worth looking into.

2. If I'm going to move to a framework later anyway should I start with one now, stick `sketches` inside `src`, let their bundler do the job and run a fetch from the output directory? No point setting up a bundler and then migrating to a framework later as well. Although this would put me pretty close to step 2 anyway so I should just do them both at once

3. Need to figure out the whole npm thing with p5. Read loads that the module doesn't export the right `.min.js` file. Must do more research.

4. How does caching work? Surely bundling would just create loads of big files and I can't share any of the modules in a higher namespace between sketches. Not that pressing right now as the sketched are small, but seems a bit wasteful. Code splitting would solve this?

5. Would be nice to set up a dev server with hot reloading for this, too. Can I do that with only one subdirectory being bundled?


## STEP 2: Replace custom router with framework and dynamic imports

Use a framework like Gatsby, Next, Sapper, etc., and replace the custom router I've made with dynamic imports to load and run the sketches.

Next seems to be the front-runner here. The dynamic routing would be great, as then my pages can just look as follows:

```
pages
|____ _error.js
|____index.js
|____[sketch].js
```

I'd then be able to import/fetch the right sketch file using the query in the param.

Gatsby's one upside is that it has the glslify plugin to set the webpack and babel configs, but I'm sure I can find a way to implement that in Next. I also don't need to programatically create pages or do any image optimisations.

#### References:

1. https://github.com/and-who/react-p5-wrapper  // React
5. https://github.com/zeit/swr  // React
5. https://github.com/onnovisser/gatsby-plugin-glslify  // Gatsby
1. https://github.com/madebywild/wild-next  // Next 👇🏾
2. https://web.dev/code-splitting-with-dynamic-imports-in-nextjs/
3. https://nextjs.org/learn/excel/lazy-loading-modules/lazy-loading
4. https://nextjs.org/docs#dynamic-import
5. https://nextjs.org/blog/next-9#dynamic-route-segments
5. https://codesandbox.io/s/p5js-svelte-3-yp7vk // Svelte & Sapper


#### Questions:
1. Need to learn more about unmounting components and memory here. If all the sketch logic is scoped to the component then unmounting should clear it all from memory. Do I still need to call p5's `remove()` function? Perf could go down the shitter fast with these sketches so I need to be clear on that.

2. Relatedly, how do I keep the sketch logic not dependant on any framework, but executable inside of a component? I want the sketches to be as "plug-and-play" with anyone elses code as possible, but I also don't want to pollute the global namespace if I keep the sketch in memory and then call it later. Is it literally just `async import regularSketchFileWithOnlyLibDeps -> execute onMount -> unMount cleanly -> job done`. That sounds too easy!

3. Does code-splitting work correctly with this setup? Not sure if the frameworks just look for how much code is statically imported in components (that are imported into pages) to do this. If so then the dynamic import setup from `/sketches` wouldn't get the benefits? Then I'm left still pondering question 4 in step 1.

## STEP 3: Custom components to decouple repo from p5 and allow for other library usage (THREE etc.)

Finally, I want to be able to use Generative to house other expermiments alongside p5 ones. Maybe I'll want to do some THREE, WASM, Blotter, ml5 or even vanilla sketches. To do these in an SPA I'll need to create a component for each type of sketch that can render and unmount them properly. How should I go about this?

#### Questions:
1. After putting in all this thinking to create an SPA where I basically just need sketches to run only on their page, and be able to navigate between them, I'm left wondering if I should just use a bundler to also create separate html pages for each sketch. I'll then be able to use whatever the hell library I like to render sketches, right? Are there any reasons I actually need this site to be an SPA? 🤔 🤔 🤔 I first made it an SPA to avoid writing out so many html pages, but if I'm already going to implement a bundler...

    * Pros
        * Fully vanilla sketches
        * No framework to maneuvre around
        * More beginner friendly for contributors or people who want to fork for own purpose
        * Frameworks could help with implementing some features (passing state, transitions, code-splitting, etc. mentioned below)
    * Cons
        * Build times might get very long after a while
            * Would need to sort out caching to avoid this?
        * I wouldn't be able to pass props and state to sketches if I need to (which I probably won't tbh)
        * Wouldn't be able to do any fancy transitions or loading states. Suspense would be great here.
        * Would parts of the bundles be cached separetely? Don't want loads of large files that the browser can't share between sketches. Back to the code-splitting question.
        * It's fun to learn some of the complex stuff!