# Recourses Usage And Complexity
This package will not add translation bundle size to app bundle size, and there is no need to wrap your entire hierarchy in a provider, it fetches/loads translation files, let's talk about complexity and the resources this package consumes (find more about how this package works by [reading this](./how-works.md)). <br>

There are 2 resources this package uses to show translations:
- CPU Usage
- Hard Disk Usage

And the 2 kinds of complexity we talk about:
- Time Complexity
- Space Complexity

<br>

Because server and client localization works differently, you can read the section that you need.
- [Server localization](#for-server-localization)
- [Client localization](#for-client-localization)

<br>

And you should read:
- [Space complexity](#about-space-complexity)
- [Notes](#notes)

<br>

*In total, 2 functions do the heavy lifting, `init` and `get`.*


## For `Server` localization:
After calling `init` the localization class reads all the translation files based on the options, and loads all translations into memory, this action is CPU and Disk consumable, nowadays servers have SSD so you don't need to worry about this, but what about CPU? If you make sure this init function calls only once per app, no need to worry about this too (let's say you have a server with 2 core CPU, and almost doesn't matter how many files you have or how long your file is, this reads happen once and in `most cases` the cost of this action can be ignored, but first you should test to decide this cost is ignorable or not based on your situation). <br>

*Also, there is a hidden cost of reading files (as text) and converting those files to json.* <br>

Time to talk about `get`, if you call this function without argument this only returns the whole translation for a locale, if you call it with an array of strings as an argument, this creates an object, maps through the argument array, extracts the parts from translations object, and put it in the created object, finally returns that object.<br>

But typically the length of the array you passed to `get` is a single digit, to make a long story short, the time complexity of this action is `1` (although there is space allocation, some ifs, and loops involved when calling `get`, this space complexity is not the space complexity that matters, also we can say that the time complexity is 1). <br>

*The space complexity that matters is the spaces that are required to hold translations and let's call it the `translations object`. [more info](#about-space-complexity)*

Summary:
- Calling `init`: Uses CPU, Hard Disk, and Memory.
- Calling `get`: Access to translation, with time complexity of `1`.


## For `Client` localization:
Calling `init` only stores the options in the localization class. <br>

Calling `get` with an array of arguments, returns a corresponding translation part or fetches the partition/translation, if the translation of the item exists returns it, otherwise fetches it. <br>

Cost of returning translation is `1` (some ifs, some loops, and object creation is involved but in total, we can say the cost is `1`). <br>

The cost of fetch depends on whether you set `enablePartition` to true or not, and the size of the translation files, by setting `enablePartition` to true, `get` only fetches the required partition so this reduces the latency costs and requires less byte to transfer so `get` function resolves faster. <br>


Summary:
- Calling `init`: Just save options // constant time
- Calling `get`: It depends on the server to send translation files, the client connection latency, the client network speed, and the size of the file you want to transfer... // it's an async function and can't really say.



## About Space Complexity...
Let's consider we have a json file with `~15K lines` small to mid-length texts, hard to tell the exact amount of memory required for holding this json, because it depends on machine hardware (in this case can be server or client machine) and node version, plus some overhead relevant to json file, but let's consider this json occupy `1MB` of memory (actually I read such a file and measure heap usage, the usage was ~900KB), now let's say you have 50 different language:

- `For server localization`: Because this reads all translation when init calls, this needs `~50MB` of memory to hold this (I may have oversimplified this by multiplying). <br>

- `For client localization`: This calls translation as needed and stores localization objects in client machine memory, even if this class loads all translation files, is 50MB important? In most cases, the answer is NO, but the cost of calling those translation files matters.

<br>

*But...* <br>
In the real world, do we need to support 50 languages and ~15K lines for a json file?? the answer is `NO`, in most projects, we end up using a few languages (less than 10) and around 2-3K lines json file, also sometimes you only need support for 2-3 different languages with less than 2K lines.<br>

Thus
- `for server localization`: This package uses less and less memory, and the time for reading these files is reduced too. And with today's machines, we probably can ignore the time and space complexity effect.
- `for client localization`: In this case, because files must transfer to the client, and the size of 2-3K lines json file is `~100K`, this is also the cost you should care about. (it's possible to split this into multiple files by setting enablePartition to true, but this action costs you more requests, and you should think about which one is more important) [read about file organization strategies](./define-translation.md)


*for client localization, `get` only downloads the partition/translation that the page requires and as the user navigates more in the app it fetches more and more, so memory usage grows.* <br>


### Notes
- ***`[client localization]`: Using client localization with enablePartition costs you request, but requires fewer bytes to download and handles faster, thus the question is, more speed in showing text and fewer bytes to download `or` less request to the hosting server? Which one you choose?***

- ***`[server localization]`: The cost of reading files per app is low but reading files for each request is NOT, so that's why you must make sure the `init` function is called only once per app***
