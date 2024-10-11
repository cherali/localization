## Dynamic Text
If you need to calculate a value and put that value in the translation text read this page. <br>

If you want to replace a placeholder in text with a value this action is called interpolation, by default this package not give you this action out of the box, so if you want this feature follow this steps:

- Step 1:<br>
Add your interpolate function to your source code

- Step 2:<br>
Call the interpolate function with translated text and value

And we are done!

***Why is this action not added to this package? Because this kind of usage is limited and there is no need to make it a main feature.***

<hr>

Here an example for interpolate function using Regular Expression:
```js
function interpolate(text, params) {  
  return text.replace(/{{\s*([^}]+)\s*}}/g, (match, name) => {  
    return params[name] !== undefined ? params[name] : match;  
  });  
}
```
<br>

```js
const trx =  localization.get(["Home"]) // imagine this returns {Home:{ text: "name is: {{name}}, and value is: {{value}}"}}

console.log(interpolate(trx.Home.text, {name: 'A', value: 1})) // logs `name is: A, and value is: 1`

```

- **Obviously, you can use any method that do this replacement.**
- ***You can change the name matching-pattern if you want.***
