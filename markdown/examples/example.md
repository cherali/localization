# How to use this package
Here you can see the steps you need to take to make this package work. <br>
And see implementation for different frameworks/libraries.


# Links
It's better to read the steps, then watch examples. 
- [Steps](#steps)
- [Implementation Example](#implementation-examples)




## Steps
- Step 0: <br>
Determine whether you want `client` localization or `server` localization, and read how this package works behind the scenes.
  - [server localization](../how-works-server.md)
  - [client localization](../how-works-client.md)

  *How the client or server works is important, methods in both classes are almost identical, and the implementation is different for `init` and `get`.*

<br>

- Step 1: <br>
Select your strategy and add files for the locales [more info](../define-translation.md).

<br>

- Step 2: (optional)<br>
If you are using typescript override corresponding types [more info](../add-type-support.md)

<br>

- Step 3: (very important)<br>
Call the `init` function, Make sure this function calls `once` for the entire life-cycle of your app, if you are using server localization, `init` reads all translation files when called, so calling this function for each request is costly. [Resources Usage](../resources.md)

<br>

- Step 4: (important) <br>
Call `setLocale` function <br>
  + For `server` localization: This function accepts another function that returns locale, make sure you use a handler that returns a consistent locale for the entire life-cycle of the request (cookies do this job).

  + for `client` localization: This function is responsible for changing the localization locale, make sure you set the correct locale (using state, URL, cookies, ... will do this job).

  *If you are using server localization don't use URL (pathname), this changes each time the server receives a new request (using URL causes a mismatch in translation text that user requested locale).*

<br>

- Step 5: <br>
Use `onMismatchLocale` to handle redirection if the user wants to access a locale that's not defined. <br>
If you are using middleware and want to customize the localization behavior (like removing defaultLocale from the URL) you can do the redirection in middleware, you can ignore this function. <br>

<br>

- Step 6: <br>
Use `get` to access translations. <br>
In `server` localization `get` is a normal function, but in `client` localization `get` is an async function.


- Step 7: (optional) <br>
You can customize the behavior of the localization as you desire.
  + server localization: You can use a middleware.
  + client localization: Can do it with few ifs and the help of routing.


If you want to change placeholder in text, [Read this](../dynamic-text.md). <br>

And done! <br>


## Notes
- ***Make sure the init function calls only `once` per app, `important` for `server` localization, and not really useful for `client` localization.***
- *Make sure you define the correct path for localization.*
- If you are using a framework you may need to adjust navigation links and some methods.


## Implementation Examples
A quick solution to work with this package is if you have problem using this package.

+ Server Localization
  - [Next.js](./server-example/nextjs.md)

+ Client Localization
  - [React.js](./client-example/reactjs.md)

***This list will be updated in the future to add more example.***