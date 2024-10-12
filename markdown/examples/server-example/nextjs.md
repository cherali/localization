# Implementation for `Next.js`
This is just an example of how you can use this with Next.js and Typescript.<br>
You can modify it however you want.

- Step 0: localization type -> server localization

- Step 1: strategy -> `single file` for translation <br>
In public/locales create
  - fr.json
  - en.json

```json
{
  "Home": {
    "hi": "hey you!!"
  },
  "About": {
    "aboutUs": "about us"
  }
}
```

*Change the key and content as you see fit.*

- Step 1.X: create config file in `src/constants/config.ts` and put this code into it:

```ts
import type { LocalizationOptions } from "sc-localization";
const locales = ["en", "fr"] as const;

type LocalesType = (typeof locales)[number];

interface LocalizationConfig extends Pick<LocalizationOptions<LocalesType>, "locales" | "defaultLocale"> {
  cookieLanguageKey: string;
}

export const localizationConfig: LocalizationConfig = {
  locales: [...locales],
  defaultLocale: "en", // default locale
  cookieLanguageKey: "lang", // cookie key name
};
```

- Step 2: Add type support <br>
In `src/types/sc-localization` paste this

```ts
import { localizationConfig } from "../constants/config";

import en from "../../public/locales/en.json";
import fr from "../../public/locales/fr.json";

declare global {
  type Locales = typeof localizationConfig.locales; // available locale
  type Localization = typeof en | typeof fr; // localization types
}
```

- Step 3 - 5:
  - 3: calling init `once` for production
  - 4: `setLocale` handler must return consist locale for entire a request life-cycle
  - 5: handle mismatch locale, I'm using a middleware to override some behavior ([more info](#middleware)) 

  In development because of `HMR` you need to call `init` function each time you save the file, but in production no need to do this, and init `must` calls only once per app, you can do this however you want but I use environment variable and call init function in RootLayout, also using cookies to make sure the locale remain consistent for entire of request life-cycle <br>

First let's create a few helper in `src/utils/localization.ts`

```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localization } from "sc-localization/server";
import { localizationConfig } from "../constants/config";

// init localization function
function initLocalization() {
  try {
    localization.init({
      path: "/public/locale",
      locales: localizationConfig.locales,
      defaultLocale: localizationConfig.defaultLocale,
      textDirection: {
        en: "ltr",
        fa: "rtl",
      },
    });
  } catch (e) {
    throw new Error(`${e}`);
  }
}

/**
 * call this to add localization
 * using env `LOCALIZATION_INIT` to make sure the init function calls once per app
 * because init function must calls once per app, I use env to check it, then call this function in `RootLayout`, however
 * feel free to change it if you want, just make sure init calls once per app.
 */
export function addLocalization() {
  const env = process.env.NODE_ENV;

  // for production, control calling init by env variable
  if (env == "production") {
    if (process.env.LOCALIZATION_INIT != "true") {
      process.env.LOCALIZATION_INIT = "true";
      initLocalization();
    }
  } else {
    /**
     * here goes others envs
     * in development each time you press save, init function must be called
     * this action is required because of HMR!
     * for `test` env calling, init once is enough, but it depends on you
     */
    initLocalization();
  }

  // set read locale function
  localization.setLocale(readLocale);

  /**
   * if locale not match, redirect to default locale
   * this function redirect to /[defaultLocale], so user lose url path
   * if you need to preserve path, pass it to redirect function
   * if you use middleware example, this code never triggers, and middleware returns a 404 page
   */
  localization.onMismatchLocale(readLocale(), (defaultLocale: string) => {
    redirect(defaultLocale);
  });
}

/**
 * this function make sure `get` returns right translation for entire life-cycle of a request,
 * getting language from `params` make translation in-persistent when app handles large number of request for different languages,
 * so need a persistent way to get right translation, the easiest one is to use cookies
 * @returns - a locale as string
 */
export function readLocale(): string {
  try {
    return cookies().get("lang")?.value || localizationConfig.defaultLocale;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return localizationConfig.defaultLocale;
  }
}

/**
 * create async version of localization.get
 * if you somehow need async version of get, you can use this
 */
export async function getAsync<K extends keyof Localization>(parts?: K[]) {
  await Promise.resolve();
  return localization.get(parts);
}
```

*Now need to call `addLocalization` function, in `src/layout.tsx` call this function, at same level of `RootLayout` function, i.e:*

```tsx
import { addLocalization } from "@/utils/localization";
import { localization } from "sc-localization/server";

// some other logic .... 

addLocalization();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={localization.locale} dir={localization.localeDirection}>
      <body>
        {children}
      </body>
    </html>
  );
}
```
*The `localization` class provides you with some properties and methods, you can use those to set the `lang` and `dir` of the `html` file.* <br> <br>


- Step 6: `get` the translation <br>
Now you can access translation using `get`

```tsx
import { localization } from "sc-localization/server";

function page() {
  const trx = localization.get(["Home"]); // this returns all translation related to `Home` part

  return (
    <div>
      <p>post</p>
      <p>{trx.Home.hi}</p>
    </div>
  );
}
```

*If you want to access translations in metadata, you should use the function version of metadata, otherwise, this doesn't work, that's because of how Next.js works behind the scenes.* <br>

- Step 7: <br>
I have already decided to change some behavior of localization using middleware ([check this](#middleware)), you are free to choose your own style, for example, if you don't mind to have [locale] folder around all your routes, and don't want to remove default locale from URL, you may not need middleware at all. <br>

You need one more step to make this work which is to provide a method for the user to change the locale, for this, in `src/components/LocaleSelection.tsx` paste this:

```tsx
"use client";
import React from "react";
import { changeLocale } from "../../actions/localization";
import { usePathname } from "next/navigation";

function LocaleSelection() {
  const pathname = usePathname();

  const handleChangeLocale = (locale: string) => () => {
    changeLocale(locale, pathname);
  };

  return (
    <div className="flex gap-4 flex-col *:text-blue-800">
      <button onClick={handleChangeLocale("en")}>en</button>
      <button onClick={handleChangeLocale("fa")}>fa</button>
    </div>
  );
}

export default LocaleSelection;
```

And in `src/actions/localization.ts` paste this:

```tsx
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { localizationConfig } from "../../constants/config";
import { getLocaleMatcher } from "../../utils/string";

export async function changeLocale(locale: string, pathname: string) {
  const localeMatcher = getLocaleMatcher(pathname);
  const url = localeMatcher ? pathname.replace(`/${localeMatcher[1]}`, "") : pathname;

  let redirectUrl = `/${locale}${url}`;

  if (locale == localizationConfig.defaultLocale) {
    redirectUrl = url || "/";
  }

  // this just helper cookie to distinguish user input url from next.js redirection
  cookies().set("lrw", "1");
  cookies().set(localizationConfig.cookieLanguageKey, locale);
  redirect(redirectUrl);
}
```

*Now, let's check the middleware.*

<hr>

## Middleware
I use middleware to achieve some behaviors like:
- Remove default locale form URL.
- Remove [locale] folder, which wraps entire routes. (If you have SSG, you may need this folder)
- Load the correct language of the user type an address and press enter.

*If you have another behavior in your mind feel free to change this middleware and codes.* <br>

The final code be something like this: <br>


```ts
import { NextRequest, NextResponse } from "next/server";
import { localizationConfig } from "./constants/config";
import { getLocaleMatcher } from "./utils/string";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let response;
  let locale;

  const requestLocale = req.cookies.get(localizationConfig.cookieLanguageKey);
  let updateCookie = false;

  // create regular expression based on locales array, used to handle rewrites
  const localeMatcher = getLocaleMatcher(pathname);

  // this if remove default locale from url
  if (pathname.match(new RegExp(`^/${localizationConfig.defaultLocale}(\/.*)?$`))) {
    // remove default locale from url
    req.nextUrl.pathname = pathname.replace(`/${localizationConfig.defaultLocale}`, "");

    // save default locale as locale
    locale = localizationConfig.defaultLocale;

    // save redirect response
    response = NextResponse.redirect(req.nextUrl);

    // if locale in request not equal to default locale, update cookie
    if (requestLocale?.value != localizationConfig.defaultLocale) {
      updateCookie = true;
    }
  }
  // this rewrite requests to remove locale from url and show correct route in app directory
  else if (localeMatcher) {
    // get locale from matcher
    locale = localeMatcher[1];

    // remove /{locale} from pathname
    req.nextUrl.pathname = pathname.replace(`/${locale}`, "");

    // save rewrite response
    response = NextResponse.rewrite(req.nextUrl);

    // when user type url with locale and press enter, if lrw not exist, update cookie
    if (requestLocale?.value != locale && !req.cookies.get("lrw")?.name) {
      updateCookie = true;
    }

    // remove helper flag
    if (response.cookies.delete("lrw")) {
      response.cookies.delete("lrw");
    }
  }
  // for rest of requests
  else {
    // save default locale as locale
    locale = localizationConfig.defaultLocale;

    // save next response
    response = NextResponse.next();

    // if locale in request is not default locale and lrw not exist, update cookie
    if (requestLocale?.value != locale && !req.cookies.get("lrw")?.name) {
      updateCookie = true;
    }
  }

  // if locale don't exist or need update, set locale
  if (!requestLocale?.value || updateCookie) {
    response.cookies.set(localizationConfig.cookieLanguageKey, locale);
  }

  if (req.cookies.has("lrw")) {
    req.cookies.delete("lrw");
  }

  if (response.cookies.has("lrw")) {
    response.cookies.delete("lrw");
  }

  // return response
  return response;
}

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```


And `src/utils/string.ts` code


```ts
import { localizationConfig } from "../constants/config";

export function getLocaleMatcher(pathname: string) {
  return pathname.match(new RegExp(`^/(${localizationConfig.locales.join("|")})(\/.*)?$`));
}
```

- *I figured out that using another cookie is the simplest way to prevent mismatch behavior when the user wants to change the locale.*

- ***If you have a client component, you can't call any methods of localization class, you can create a server component, read translation texts, and pass it to client components as props.***

- ***If you test this example, you might figure out that navigating between pages using the `back` and `forward` buttons, will not show the correct locale, this page is already too long, so it's up to you to fix this. (Hint: cache!!!)***
