TODO: move to directory sketches from single-file sketches

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

Addendum, is there still some way to support both single files and folders? the github link and file ordering would be broken...
