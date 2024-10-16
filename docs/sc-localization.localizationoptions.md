<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [sc-localization](./sc-localization.md) &gt; [LocalizationOptions](./sc-localization.localizationoptions.md)

## LocalizationOptions interface

The options props for init function

**Signature:**

```typescript
export interface LocalizationOptions<T extends string> 
```

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

[capitalizePartitionName?](./sc-localization.localizationoptions.capitalizepartitionname.md)


</td><td>

`readonly`


</td><td>

boolean


</td><td>

_(Optional)_ you have lowercase partition name and want to uppercase that partition when retrieve those partition

only works if enablePartition is true


</td></tr>
<tr><td>

[defaultLocale](./sc-localization.localizationoptions.defaultlocale.md)


</td><td>

`readonly`


</td><td>

T


</td><td>

default locale, this must be one of items in locales array


</td></tr>
<tr><td>

[enablePartition?](./sc-localization.localizationoptions.enablepartition.md)


</td><td>

`readonly`


</td><td>

boolean


</td><td>

_(Optional)_ whether you want to have multiple files for language or have single file for a language.

if you want separate your translation set this to true


</td></tr>
<tr><td>

[locales](./sc-localization.localizationoptions.locales.md)


</td><td>

`readonly`


</td><td>

Array&lt;T&gt;


</td><td>

list of supported locales, all reads and fetch's uses this locale array


</td></tr>
<tr><td>

[path](./sc-localization.localizationoptions.path.md)


</td><td>

`readonly`


</td><td>

string


</td><td>

the translation directory path


</td></tr>
<tr><td>

[textDirection](./sc-localization.localizationoptions.textdirection.md)


</td><td>

`readonly`


</td><td>

Record&lt;T, "rtl" \| "ltr"&gt;


</td><td>

text direction for each locale


</td></tr>
</tbody></table>
