<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [sc-localization](./sc-localization.md) &gt; [ServerLocalization](./sc-localization.serverlocalization.md)

## ServerLocalization class

if you want render files on server and send rendered page to client use this class.

this uses fs and path to read all files and you can access translation by using `get`<!-- -->.

**Signature:**

```typescript
declare class ServerLocalization 
```

## Constructors

<table><thead><tr><th>

Constructor


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[(constructor)()](./sc-localization.serverlocalization._constructor_.md)


</td><td>


</td><td>

Constructs a new instance of the `ServerLocalization` class


</td></tr>
</tbody></table>

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[locale](./sc-localization.serverlocalization.locale.md)


</td><td>

`static`

`readonly`


</td><td>

Locales\[number\]


</td><td>

return localization locale


</td></tr>
<tr><td>

[localeDirection](./sc-localization.serverlocalization.localedirection.md)


</td><td>

`static`

`readonly`


</td><td>

"rtl" \| "ltr" \| undefined


</td><td>

get locale text direction


</td></tr>
</tbody></table>

## Methods

<table><thead><tr><th>

Method


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[get(parts)](./sc-localization.serverlocalization.get.md)


</td><td>

`static`


</td><td>

use to access the translations


</td></tr>
<tr><td>

[init(options)](./sc-localization.serverlocalization.init.md)


</td><td>

`static`


</td><td>

this methods read all localization files based on locales, path and enablePartition.

you must make sure this init only calls once per app, because calling init on every request is costly operation.


</td></tr>
<tr><td>

[onMismatchLocale(locale, callback)](./sc-localization.serverlocalization.onmismatchlocale.md)


</td><td>

`static`


</td><td>

called when locale not exist on locales array


</td></tr>
<tr><td>

[setLocale(handler)](./sc-localization.serverlocalization.setlocale.md)


</td><td>

`static`


</td><td>

use to change locale


</td></tr>
</tbody></table>