# @firestitch/html-editor

## Froala assets

The package carries only the Froala files it loads: the editor's script, its stylesheet and the
`FroalaPlugin` plugins. `npm run package` copies them from `froala-editor` into
`package/assets/froala` (`scripts/copy-froala-assets.mjs`, run as `postpackage`).

The app copies them to `/assets/froala/` in `angular.json`:
```json
{
  "glob": "**/*",
  "input": "./node_modules/@firestitch/html-editor/assets/froala",
  "output": "./assets/froala"
}
```

`fs-html-renderer` loads only the stylesheet, which lays out Froala's HTML (images, videos,
tables). An app that shows HTML but never edits it copies just that:
```json
{
  "glob": "css/**/*",
  "input": "./node_modules/@firestitch/html-editor/assets/froala",
  "output": "./assets/froala"
}
```
