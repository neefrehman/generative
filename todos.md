## TODO: GLSL support

5. https://www.npmjs.com/package/webpack-glsl-loader
6. https://github.com/glslify/glslify
7. https://github.com/glslify/babel-plugin-glslify
8. https://github.com/onnovisser/gatsby-plugin-glslify
9. http://mattdesl.svbtle.com/glslify
10. https://github.com/madebywild/wild-next

## TODO: move to directory sketches from single-file sketches

```js
// Change github link in [sketch].js from files to folders
href={`https://github.com/neefrehman/Generative/blob/master/${pathToSketch}/index.tsx`}
```

```js
// Fix index getStaticProps to remove file/dir co-support
const sketches = fs
    .readdirSync(monthDirectory)
    .filter(sketchId => RegExp(/^[0-9]{6}$/).test(sketchId));

sketches.forEach(sketchId => sketchArray.push(sketchId));
```

```shell
# When in month directory, take each sketch and place it in a folder of the same name
for file in *; do  if [[ -f "$file" ]]; then
    mkdir "${file%.*}"
    mv "$file" "${file%.*}"
  fi
done
```

```shell
# When in year directory, reanem every js file (however many levels deep) to index.js
find . -iname "*.tsx" -execdir mv {} 'index.tsx' \;
```
