# sc-localization

In-memory, low bundle size, file-base localization package for JavaScript framework/library. Supports types, and works for both server and client. <br>
This package provides core functionality that you need to add localization to your project, because of this, you can customize your app localization behavior as you desire. <br>
Supports both server and client localization.

## Definitions

- `server localization`: Refers to tools which use server/node to render pages.
- `client localization`: Refers to tools which use server/node to render pages.

- `parts`: Refers to `1st depth keys` of translation object, also refers to the `1st depth keys` of locale file if you using single file for locale ([more info](./markdown/define-translation.md)).
- `partition`: Imagine you don't like to have a big file that holds all your translations, and wants to separate it into smaller files and put relative texts near each other like 'common', 'home', 'about', and..., from now those smaller parts called `partition` (you may have heard of this as, segment, scope, namespace, and..., but the functionality is more important than its name).

## Features

- Type support [add type](./markdown/add-type-support.md).
- No global wrapper around your entire app.
- Low bundle size.
- Zero dependency! (although server localization uses `fs` and `path`, but you already have these in node environment, therefore excluded from bundle size).
- Customize the localization behavior as you desire (like, remove/keep default locale from url).
- `[server localization]`: Loads all translation into memory, therefore getting translation texts in your component costs you `1`([more info](./markdown/resources.md)), also no effect on bundle size and no need to send all translation to client.
- `[server localization]`: No need to use `await` keyword when accessing translation texts.
- `[server localization]`: Able to remove `[locale]` folder as wrapper in your routes (if your framework need this routes like Next.js app directory).
- `[client localization]`: Uses fetch to get translations, by setting `enablePartition` to true, translation files can be downloaded partition by partition as needed, less bytes to transfer therefore more performance in general! [more info](/markdown/resources.md#notes).

## Limitation

This package only reads/fetches translations and gives them to you, for the rest of the functionality you are responsible for implementing it, this gives you a high level of customization but requires more time to implement also adding a feature, for example, if you want to calculate a value and put it into text translation you need to do it by yourself, although for this situation you can do it by reading [this page](./markdown/dynamic-text.md), but this was just an example.

## How It's Work?

It's depends! :)) Whether you use client or server localization, for more info [check this link](./markdown/how-works.md)

## Supporting Type

If you using typescript, and your IDE supports `intelliSense` you can add your localization type, this helps you avoid mis-spelling words and easy access (less copy/paste) to nested translation when you press `.`, also this feature is very cool :).

## Documentation

- [Full Documentation](./docs/index.md)
- [How It's Work](./markdown/how-works.md)
- [Resources Usage](./markdown/resources.md)
- [Define Translation](./markdown/define-translation.md)
- [Dynamic Texts](./markdown/dynamic-text.md)
- [Add Type Support](./markdown/add-type-support.md)
- [Example](./markdown/examples/example.md)