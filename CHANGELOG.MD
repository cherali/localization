## 2.0.0, 2.0.1 (December 4, 2024)

### Core
+ Types only importable from `sc-localization/server`, and `sc-localization/client`.
+ No need to define text direction for each locale, you can use `defaultTextDirection` to set a default text direction for all locales, and use `text direction` to override the text direction for the locales that have different text directions compared to `default`.
+ Add auto text detection `default: 'ltr'`.
+ Mark `locales` as read-only.
+ add `v` property, use to revalidate browsers auto cache.
+ Add more tests.
+ Disable map generation.
+ Some tsconfig and set `allowSyntheticDefaultImports` to false.

### Examples
+ Fix backward navigation problem for Next.js
+ Add more information for React.js

### Docs
+ Improve Docs, README and others.
+ Add migration Docs.

<br/>
