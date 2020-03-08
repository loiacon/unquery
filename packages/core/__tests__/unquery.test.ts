/* eslint-disable @typescript-eslint/no-explicit-any */
import { Unquery, stringify } from '..'
import { encode } from '../src/utils'

jest.mock('../src/utils/warn')

const arroba = encode('@')

describe('Unquery', () => {
  it('should parse primitives', () => {
    const toParse = `?email=someone${arroba}example.com&userId=123`
    const unquery = Unquery(toParse, {
      email: Unquery.string(),
      userId: Unquery.number()
    })

    expect(unquery).toEqual({
      email: 'someone@example.com',
      userId: 123
    })
  })

  it('should stringify multiple warnMocks', () => {
    const toParse =
      '?email=foo@mail.com&userId=4&arr=foo,bar,baz&open=true&startDate=2020-01-01&unknown=bar'
    const unquery = Unquery(
      toParse,
      {
        email: Unquery.string(),
        userId: Unquery.number(),
        arr: Unquery.array(),
        open: Unquery.bool(),
        startDate: Unquery.string()
      },
      {
        arrayFormat: 'comma'
      }
    )

    expect(unquery).toEqual({
      email: 'foo@mail.com',
      userId: 4,
      arr: ['foo', 'bar', 'baz'],
      open: true,
      startDate: '2020-01-01'
    })
    expect(stringify(unquery, { arrayFormat: 'comma' })).toBe(
      `email=foo${arroba}mail.com&userId=4&arr=foo,bar,baz&open=true&startDate=2020-01-01`
    )
  })

  it('should ignore when input is not a string', () => {
    const toParse = 2 as any
    const query = Unquery(toParse, {})

    expect(query).toEqual({})
  })

  it('should ignore parameter when primitive type is incorrect', () => {
    const toParse = 'a=1&b=2&c=1&c=2'
    const query = Unquery(
      toParse,
      {
        a: 42,
        b: Unquery.number(),
        c: Unquery.array(42)
      },
      { arrayFormat: 'none' }
    )

    expect(query).toEqual({ a: '1', b: 2, c: ['1', '2'] })
  })

  it('should work with falsy values', () => {
    const toParse = 'a=0&b=0&c=&d&e&unknown=1'
    const query = Unquery(toParse, {
      a: Unquery.number(),
      b: Unquery.string(),
      c: Unquery.string(),
      d: Unquery.string(),
      e: Unquery.array()
    })

    expect(query).toEqual({ a: 0, b: '0', c: '', d: null, e: null })
  })

  it('should replace repeated values', () => {
    const toParse = 'foo=1,2,3&foo=3,4,5'

    const query = Unquery(
      toParse,
      {
        foo: Unquery.array(Unquery.number())
      },
      { arrayFormat: 'comma' }
    )

    expect(query).toEqual({
      foo: [3, 4, 5]
    })
  })

  it('should replace repeated values even when is unknown key', () => {
    const toParse = 'foo=3,4,5'

    const query = Unquery(toParse, null, {
      arrayFormat: 'comma',
      skipUnknown: false
    })

    expect(query).toEqual({
      foo: ['3', '4', '5']
    })
  })

  it('should not split on encoded commas', () => {
    const toParse = 'foo=zero%2Cone,two%2Cthree'
    const query = Unquery(
      toParse,
      { foo: Unquery.array() },
      { arrayFormat: 'comma' }
    )

    expect(query).toEqual({
      foo: ['zero,one', 'two,three']
    })
  })

  it('should parse falsy key values', () => {
    const toParse = '0=1&1=2&2=4'
    const query = Unquery(toParse, {
      0: Unquery.number(),
      1: Unquery.number(),
      2: Unquery.number()
    })
    expect(query).toEqual({
      0: 1,
      1: 2,
      2: 4
    })

    const query2 = Unquery(toParse, {
      0: Unquery.string(),
      1: Unquery.string(),
      2: Unquery.string()
    })
    expect(query2).toEqual({
      0: '1',
      1: '2',
      2: '4'
    })

    const query3 = Unquery(toParse, {}, { skipUnknown: false })
    expect(query3).toEqual({
      0: '1',
      1: '2',
      2: '4'
    })
  })

  it('should parse unknown without shape', () => {
    const toParse = 'foo=1&bar=2'
    const query = Unquery(toParse, null, { skipUnknown: false })

    expect(query).toEqual({ foo: '1', bar: '2' })
    expect(stringify(query)).toEqual('foo=1&bar=2')
  })
})
