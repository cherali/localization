# How It's Work? (Client Localization)
In this page you can read about how `client localization` class works behind the scene. <br>

After importing localization, this class gives you 4 important static methods: (for more info [read doc](../docs/sc-localization.serverlocalization.md))
- init
- setLocale
- get
- onMismatchLocale


## `init` function
This function saves the options ([see options](../docs/sc-localization.localizationoptions.md)) you provide as argument (for how to define translation files [read this](./define-translation.md)). <br>
This function must calls at least once, and better not to call it multiple times. ([read resource usage](./resources.md)).<br>


## `setLocale` function
This function stores current locale in localization class. <br>
Accepts a string as argument.


## `get` function
All magic happens here! When this function calls with an argument, first check if the translation exists in client memory, if exists then returns the translation, if not, send a request to fetch the locale file, therefore this function is `async` and you should await for if (or use .then). <br>
This function fetches only requires the locale/partition that you need to show the user for a specific page, and as the user navigates between pages, this function fetches more. <br>
Later on component, you use this function to `fetch/access` the translation texts. <br>
This function uses the value that `setLocale` stores in the localization class. <br> <br>

*If multiple get calls for a partition/translation which is not exist only on fetch request triggers, and the `get` awaits for that to be handle in future.*


## `onMismatchLocale` function
This function accepts two arguments, locale and handler <br>
If the locale doesn't match the locals array you passed to the `init` function, this function executes `handler`.

```ts
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
```ts
import { localization } from 'sc-localization/client'
```

<br>

- `get()` (with argument)

```ts
// this fetches/returns only translation related to `Home`
const trx = await localization.get(["Home"])

console.log(trx.Home?.hi) // logs `hi`
console.log(trx.About) // logs undefined, you didn't request it when calling `get`

// this fetches/returns translation related to `Home` and `About`
const trx2 = await localization.get(["Home","About"])
console.log(trx2.Home?.hi) // logs `hi` // just return
console.log(trx2.About?.about) // logs `about` // fetch
console.log(trx2.Common) // logs undefined, you didn't request it when calling `get`
```
<br>

- ***If you set `enablePartition` to `true` the `get` function fetches partitions piece by piece as the app needs those, resulting in fewer bytes being downloaded, thus performance improves! [more info](/markdown/resources.md#notes)***

- **If your IDE supports intelliSense and you already override `Localization` type/interface, the IDE gives you some suggestions as you type.** [how to add type support](./add-type-support.md)

- You can use `onMismatchLocale` method to redirect to defaultLocale if locale is not valid.

- When `get` sends a request to fetch a locale or a partition, get will not send another request for that locale or partition until the request is resolved.

- **You need to call init first, then setLocale, later call get for fetch/access to translation (you can think of onMismatchLocale as third step).**


<br>

What happen if need dynamic texts??? (replace placeholder with value in text) [Read this](./dynamic-text.md)

<hr>

*Now, let's go through a scenario step by step:* <br>
*consider `enablePartition` and `capitalizePartitionName` both set to `true`*

```ts
//*
await localization.get(["Home"]) // fetches/returns home partition
//

//*
await localization.get(["About"]) // fetches/returns about partition
//

//*
await localization.get(["Home"]) // just returns home partition because it already exist in memory
//

//*
await localization.get(["Home", "About"])// just returns home and about partition, both partitions already exists in memory
//


//*
await localization.get(["Common"]) // fetches/return common partition

// for this line there is 3 possible situation based on previous get state
// 1. [success]: previous request fetches common partition => no need to fetch, just returns common partition.
// 2. [failed]: previous request failed to fetch => calls to fetch partition.
// 3. [fetching]: previous request not resolved => just wait for it to be resolved.
await localization.get(["Common"]) 
```
