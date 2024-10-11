<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [sc-localization](./sc-localization.md) &gt; [ClientLocalization](./sc-localization.clientlocalization.md) &gt; [get](./sc-localization.clientlocalization.get.md)

## ClientLocalization.get() method

use to access the translations

**Signature:**

```typescript
static get<K extends keyof Localization>(parts: K[]): Promise<ITranslation<K>>;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

parts


</td><td>

K\[\]


</td><td>

list of parts/partition in your translation, or undefined


</td></tr>
</tbody></table>
**Returns:**

Promise&lt;[ITranslation](./sc-localization.itranslation.md)<!-- -->&lt;K&gt;&gt;

- if calls with `no params`<!-- -->: returns existing translations base on locale.

- if calls with `array of string`<!-- -->: if part exist get it from translation object then returns it, if not fetch the translation
