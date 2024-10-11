# How It's Work? (Server Localization)
In this page you can read about how `server localization` class works behind the scene. <br>

After importing localization, this class gives you 4 important static methods: (for more info [read doc](../docs/sc-localization.serverlocalization.md))
- init
- setLocale
- get
- onMismatchLocale


## `init` function
This function based on the options ([see options](../docs/sc-localization.localizationoptions.md)) you provide as an argument tries to read the locale files (using `fs` and `path`), and stores those into an object (for how to define translation files [read this](./define-translation.md)). <br>
When you using server localization you must make sure this function calls once per app, also make sure this function `NOT` calls for each request ([read resource usage](./resources.md)).<br>


## `setLocale` function
This function it used to set a handler that returns a `consistent locale for each request`. <br>
It's best to use a cookie to ensure that for each request, it returns the correct locale that the user needs. <br>
I emphasize that this must be a function and return the same locale for the entire life-cycle of a request.

## `get` function
Later on components, you use this function to access the translation texts. <br>
This function uses the handler that `setLocale` stores in the localization class. <br> <br>

This function can be called in two ways:
- With `no argument`: which returns the all available translations for a locale.
- With `array of string`: which returns only the translation related to those parts.


## `onMismatchLocale` function
This function accepts two arguments, locale and handler <br>
If the locale doesn't match the locals array you passed to the `init` function, this function executes `handler`.

```js
localization.onMismatchLocale(currentLocale, defaultLocale => {
  // if locale doesn't match, do something (i.e, redirect)
});
```


<br>

Let's see it in action, imagine you have this content in your translation file:
```json
{
  "Home": {
    "hi": "hi"
  },
  "About": {
    "about": "about"
  },
  "Common": {
    "logOut": "log out"
  }
}
```

<br>

*And you already import the localization class* 
```js
import { localization } from 'sc-localization/server'
```

<br>

- `get()` (no argument or undefined):

``` js
// this return entire content of translation file
// so you can have access to `Home`, `About` and `Common`
const trx = localization.get() 

console.log(trx.Home.hi) // logs `hi`
console.log(trx.About.about) // logs `about`
console.log(trx.Common.logOut) // logs `log out`
```

***Which is NOT recommended, because this object getting bigger and bigger as your project grows, also no need to read all translation at all.***

<br>

- `get()` (with argument)

```js
// this return only translation related to `Home`
const trx = localization.get(["Home"])

console.log(trx.Home.hi) // logs `hi`
console.log(trx.About) // logs undefined, you didn't request it when calling `get`

// this returns translation related to `Home` and `About`
const trx2 = localization.get(["Home","About"])
console.log(trx2.Home.hi) // logs `hi`
console.log(trx2.About.about) // logs `about`
console.log(trx2.Common) // logs undefined, you didn't request it when calling `get`
```


- **If your IDE supports intelliSense and you already override `Localization` type/interface, the IDE gives you some suggestions as you type.** [how to add type support](./add-type-support.md)

- You can use `onMismatchLocale` method to redirect to defaultLocale if locale is not valid.

- **You have to think linearly, first: init, second: setLocale, then: access translation (you can think of onMismatchLocale as third step).**

<br>

What happen if need dynamic texts??? (replace placeholder with value in text) [Read this](./dynamic-text.md)
