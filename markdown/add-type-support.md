# How To Add Type Support
This package offers you type support, if you are using typescript you can activate this by overriding 2 type/interface. <br>

Adding type support for both client and server is the same, but `enable Partition` and `capitalizePartitionName` will affect this type ([more info](./define-translation.md)). <br>

***In your types directory, create a file and name it `sc-localization.d.ts`.*** <br>

- For adding type if you are using `single file` for a locale strategy copy this: (`enablePartition: false`)

```ts
import en from 'TRANSLATION_FOLDER_PATH/en.json'
import fr from 'TRANSLATION_FOLDER_PATH/fr.json'

declare global {
  type Locales = ['en','fr']; // available locale
  type Localization = typeof en | typeof fr; // localization types
}
```

- For adding type if you are using `multiple files` for a locale strategy, copy this (`enablePartition: true`). <br>

*Imagine you use the lowercase name for partition, and you set `capitalizePartitionName` to true, therefore you should have something like this in your `.d.ts` file*

```ts
import homeFr from "TRANSLATION_FOLDER_PATH/home/home.fr.json";
import homeEn from "TRANSLATION_FOLDER_PATH/home/home.en.json";
import aboutFr from "TRANSLATION_FOLDER_PATH/about/about.fr.json";
import aboutEn from "TRANSLATION_FOLDER_PATH/about/about.en.json";

declare global {
  type Locales = ["fr", "en"]; // available locale
  // localization types
  interface Localization {
    Home: typeof homeFr | typeof homeEn; // `Home` should be `home` if you set `capitalizePartitionName` to `false`
    About: typeof aboutFr | typeof aboutEn; // `About` should be `about` if you set `capitalizePartitionName` to `false`
  } 
}
```


- *If you set `enablePartition` to true, sorry to say that, but you have to add the relevant types manually*
- *This file is a `.d.ts` (declaration) file, and doesn't matter how many imports you have here, this is just a development thing and doesn't effect the production bundle*
- *Adding one translation will add the type support, but it's better to add all translation files, because sometimes you might forget to add a new translation to all your translation files, by adding all files, the new text doesn't show up in the suggestion list and you can fix it in the earlier stage of your task.*
- *You can define your localization config somewhere and use it for overriding the `Locales type` (which you can see in [example](./examples/example.md#implementation-examples) section).*

<br>

*That's it, now you should have a type suggestion when you type the `get` argument, and when you want to access translation texts (the object that `get` returns).*
