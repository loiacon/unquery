# Unquery 🍫

[![Version npm](http://img.shields.io/npm/v/unquery.svg?style=flat-square)](https://www.npmjs.com/package/unquery)
[![Dependencies](https://img.shields.io/david/loiacon/unquery.svg?style=flat-square)](https://david-dm.org/loiacon/unquery)

Build and control query-strings with confidence.

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

const stringified = unquery.stringify({ arrayFormat: 'bracket' })
console.log(stringified)
```
```js
"?foo=str&bar=123&baz[]=1&baz[]=2&baz[]=3&date=2020-01-01"
```

## API
```ts
Unquery(input: string, schema: object, config: object)
```

#### @param input: `string`
Input to be parsed.


#### @param schema: `object`
Your query-string schema, that's gonna be parsed.

#### @param config: `object`
Options to customize the schema that's gonna be generated.

**Options**

- **pattern**
  - **Description** Used to parse Unquery.date query-strings. It uses tokens to create the format.
  - **Type** `string`
  - **Default** `YYYY-MM-DD`
  - **Tokens** current supported tokens:
  ```js
  {
    "YYYY": "4-digits Year",
    "MM": "Month",
    "DD": "Day",
    "HH": "Hours",
    "mm": "Minutes",
    "ss": "Seconds"
  }
  ```

 <br>

- **arrayFormat**
  - **Description** Array format to parse query-string. Use the same format used by [query-string](https://github.com/sindresorhus/query-string).
  - **Type** `string`
  - **Default** `none`
  - **Values** Each value will parse the following query-strings into an array:
  ```js
  "bracket": "foo[]=1&foo[]=2&foo[]=3"
  "index": "foo[0]=1&foo[1]=2&foo[3]=3"
  "comma": "foo=1,2,3"
  "none": "foo=1&foo=2&foo=3"
  ```

<br>

- **skipNull**
  - **Description** Skip `null` values to be parsed.
  - **Type** `boolean`
  - **Default** `false`
  ```js
  Unquery('?value=123', {
    value: Unquery.number(),
    notInQueryValue: Unquery.string()
  }, { skipNull: false })

  // { value: 123, notInQueryValue: null }
  ```
  ```js
  Unquery('?value=123', {
    value: Unquery.number(),
    notInQueryValue: Unquery.string()
  }, { skipNull: true })

  // { value: 123 }
  ```

 <br>

- **skipUnknown**
  - **Description** Skip `unknown` values to be parsed.
  - **Type** `boolean`
  - **Default** `true`
  ```js
  Unquery('?value=foo&unknown=bar', {
    value: Unquery.string()
  }, { skipUnknown: false })

  // { value: "foo", unknown: "bar" }
  ```
  ```js
  Unquery('?value=foo&unknown=bar', {
    value: Unquery.string()
  }, { skipUnknown: true })

  // { value: "foo" }
  ```

### Unquery Methods
When you create an `Unquery Object`, your query will receive some super powers ⚡️!

```js
const query = Unquery(...) // query is an Unquery Object
```

#### Methods
- **stringify**
  - **Description** stringify your object and return his value
  - **Type** `(options: StringifyOptions) => string`
  - **Default**
  ```js
  {
    // You can set your unqueryOptions by calling setOptions(options)
    arrayFormat: unqueryOptions.arrayFormat // default: 'none',
    pattern: unqueryOptions.pattern // default: 'YYYY-MM-DD'
  }
  ```
  - **Examples**
  ```js
  const query = Unquery('?startDate=2020-01-01&viewId=4', {
    startDate: Unquery.date(),
    viewId: Unquery.number()
  })
  // { startDate: [object Date], viewId: 4 }

  const stringified = query.stringify({ pattern: 'DD/MM/YYYY' })
  // "startDate=01/01/2020&viewId=4"
  ```

#### Global API
- **addLocationURL**
  - **Description** Add query-string to URL. This keeps all current search.
  - **Type** `(query: object | string, options: StringifyOptions) => void`
  - **Default** `null`
  - **Example**
  ```js
  import { addLocationURL } from 'unquery'

  // https://yoursite.com/
  const query = Unquery('?foo=bar&baz=42', {
    foo: Unquery.string(),
    baz: Unquery.number()
  })

  addLocationURL(query)
  // https://yoursite.com?foo=bar&baz=42

  addLocationURL('date=2020-09-01')
  // https://yoursite.com?foo=bar&baz=42&date=2020-09-01
  ```

- **replaceLocationURL**
  - **Description** Replace all URL search by the query-string.
  - **Type** `(query: object | string, options: StringifyOptions) => void`
  - **Default** `null`
  - **Example**
  ```js
  import { replaceLocationURL } from 'unquery'

  // https://yoursite.com/
  const query = Unquery('?foo=bar&baz=42', {
    foo: Unquery.string(),
    baz: Unquery.number()
  })

  replaceLocationURL(query)
  // https://yoursite.com?foo=bar&baz=42

  replaceLocationURL('date=2020-09-01')
  // https://yoursite.com?date=2020-09-01
  ```
- **clearLocationURL**
  - **Description** Clear all query-string from URL without reload the page.
  - **Type** `() => void`
  - **Default** `null`
  - **Example**
  ```js
  import { clearLocationURL } from 'unquery'

  // https://yoursite.com/?foo=bar&baz=42
  const query = Unquery('?foo=bar&baz=42', {
    foo: Unquery.string(),
    baz: Unquery.number()
  })

  clearLocationURL()
  // https://yoursite.com/
  ```
- **stringify**
  - **Description** Stringify an object into a query string.
  - **Type** `(queryObject: UnqueryObject, options: StringifyOptions) => string`
  - **Default**
  ```js
  {
    // You can set your unqueryOptions by calling setOptions(options)
    arrayFormat: unqueryOptions.arrayFormat // default: 'none',
    pattern: unqueryOptions.pattern // default: 'YYYY-MM-DD'
  }
  ```
  - **Examples**
  ```js
  import { stringify } from 'unquery'

  const stringified = stringify({ startDate: '2020-01-01', viewId: 4 })
  // "startDate=2020-01-01&viewId=4"
  ```

- **setOptions**
  - **Description** Set default options to use in your entire app.
  - **Type** `(options: UnqueryOptions) => UnqueryOptions`
  - **Examples**
  ```js
  import Unquery, { setOptions } from 'unquery'

  setOptions({
    arrayFormat: 'comma',
    pattern: 'YYYY-MM-DD',
    parsePattern: null,
    encodePattern: 'DD/MM/YYYY',
    skipNull: true,
    skipUnknown: false
  })

  const unquery = Unquery('?date=2020-02-01&foo=1,2,3', {
    date: Unquery.date()
  })
  // { date: [object Date], foo: ['1','2','3'] }

  const stringified = unquery.stringify({ arrayFormat: 'index' })
  // 'data=01/02/2020&foo[0]=1&foo[1]=2&foo[2]=3
  ```
