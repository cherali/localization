
### `V1` to `V2`

+ You can't import from `sc-localization` directly, so change the imports path.
+ You don't need to add all text direction when calling `init`, you can use `defaultTextDirection` in order to just add locales with different direction to `textDirection` property.
+ `locales` now read-only so no need to destructuring the locales that assets as const to add type support (just remove destructuring and you good to go).
+ If you had to enable `allowSyntheticDefaultImports` flag in `tsconfig` for make this package works, now you can remove this flag.

