# Unquery 🍫

Build and control queries with confidence.

It helps you to parse and stringify `query-strings` in a predictable way.


## Instalation
To install, use:

Yarn:
```s
yarn add --save unquery
```

Npm:
```s
npm install --save unquery
```

## Usage

### Example 1 - Basic Usage
```js
import Unquery from 'unquery'

const unquery = Unquery('?foo=bar', {
  foo: Unquery.string()
})

console.log(unquery)
```
```js
{ "foo": "bar" }
```

---

### Example 2 - Different types usage
```js
const unquery = Unquery('?foo=str&bar=123&baz=1,2,3&date=2020-01-01&unnecessary=false' {
  foo: Unquery.string(),
  bar: Unquery.number(),
  baz: Unquery.array(Unquery.number()),
  date: Unquery.date('YYYY-MM-DD')
}, { arrayFormat: "comma" })

console.log(unquery)
```
```js
{
  "foo": "str",
  "bar": 123,
  "baz": [ 1, 2, 3 ],
  "date": [object Date] // will return a JavaScript date
}
```

---

### Example 3 - Stringify usage
```js
const unquery = Unquery('?foo=str&bar=123&baz=1,2,3&date=2020-01-01&unnecessary=false' {
  foo: Unquery.string(),
  bar: Unquery.number(),
  baz: Unquery.array(Unquery.number()),
  date: Unquery.date('YYYY-MM-DD')
}, { arrayFormat: "comma" })

const parsed = unquery.stringify({ arrayFormat: 'bracket' })
console.log(parsed)
```
```js
"?foo=str&bar=123&baz[]=1&baz[]=2&baz[]=3&date=2020-01-01"
```
