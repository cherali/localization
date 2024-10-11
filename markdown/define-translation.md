# Define Translation Files
There are two strategies that you can choose for managing the translation files:
- `ST1`: One language, one translation file.
- `ST2`: Separate files, based on partition, you must set `enablePartition` flag to `true` when calling `init` function
<br>

**First of all, you need to create a folder for your translation files in your `public directory`, you can name it anything that you want, but for now let's call it `locales` (actually if you using server localization you can create this `locales` anywhere you want but for client localization, this must be in the public folder).**

<br>

*Now, let's add localization for `de` and `en` languages with `Home` and `About` partition/part* <br>

## Available Strategies:
* `ST1`: <br>
In `locales` folder, for each language create a json file, i.e `en.json`, `de.json` and so on ..., content of each file should be something like this (in this scenario, `parts` refers to `Home`, `About` and ...).

```json
{
  "Home": {},
  "About": {}
}
```
Now you can add your translation text in relevant part. <br>

* `ST2`: <br>
By setting the `enablePartition` flag to `true`. <br>
In locales folder create `home` and `about` folder, then create translation files for each locale matches `[partitionName].[locale].json` pattern, so you should have this: <br>


```bash
public
├── locales
│   ├── home
│   │   ├── home.en.json
│   │   └── home.de.json
│   │     
│   └── about
│       ├── about.en.json
│       └── about.de.json   
```
And add your translation text to relevant file. <br>

## Call `init` with options
Now, let's configure init function, and there is 4 property required to set. ([more info](../docs/sc-localization.localizationoptions.md))
- `path`: the path which your locales exist, which is `/public/locales`.
- `locales`: list of locales, which is ['en','de'].
- `defaultLocale`: one of property in locales array,.
- `textDirection`: an object that map a locale to `ltr` or `rtl` (you can access locale direction via `localization.localeDirection` property, that's why is field is necessarily).

<br>

+ *If you using `ST2` set `enablePartition` to `true`* <br>

+ If you set `enablePartition` to true, you can set `capitalizePartitionName` flag too, for more info, read [notes section](#very-important-notes) in this page.<br>


***At the end of this page you can see complete example of calling `init`.***

<br>



## Very Important Notes!
- *It doesn't matter which strategy you use, accessing translation with `get` doesn't change.*

- ***If you using ST2, you can't change the folder structure pattern (`partitionName/[partitionName].[locale].json`), and recommend to use lowercase for the partition name, but if you capitalize the partition name, you must capitalize the partition name in translation files which are not recommended, if you want to use capitalize partition name, just set `capitalizePartitionName` to true.***

- **The `capitalizePartitionName` property only works for `ST2`, and you use it when you want to capitalize the partition name, if you set this flag to `true`, `home` became `Home` when you want to access it using `get` method (i.e, `get(["Home"])`). if you using `ST1` and want capitalize name, you must do it by yourself (check out ST1 in [Available Strategies](#available-strategies) section).**

- **In translation files, you can use nested objects as much as you want, later in the code after calling the `get` function your IDE `intelliSense` gives you suggestions and autocomplete if you are using typescript.**

- *I know! I know! In ST2 having partition name at the start of json files is redundant, but when you have more partitions and locales this helps you find the correct file easily (don't like it? I might add some kind of pattern matching in the future, but for now, just bear with it!:))) ).*

- I'd like to have partition/part names capitalized (just for more specification), but at the end of the day, it depends on you, so, feel free to use your own naming convention.

<hr>

`init` function:

```js
import { localization } from 'sc-localization/server' // if you use server localization


// somewhere in your code, when you calling `init`
localization.init({
  path: "/public/locales", // because in public folder we have locales folder which contain localization files
  locales: ["en", "de"] // list of locales
  defaultLocale: "en",
  textDirection: {
    en: "ltr",
    de: "ltr"
  },
  enablePartition: true, // is you using ST2, remove it otherwise
  capitalizePartitionName: true, // if you using ST2, and in locales folder have lowercase partition, but want to use uppercase when you use `get`
})

```