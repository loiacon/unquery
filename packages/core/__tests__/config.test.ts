import { Unquery, setOptions } from '..'
import { encode } from '../src/utils'

const bar = encode('/')

describe('Unquery config', () => {
  it('should parse with skipNull as false', () => {
    const toParse = '?'
    const unquery = Unquery(
      toParse,
      { someNull: Unquery.string() },
      { skipNull: false }
    )

    expect(unquery).toEqual({
      someNull: null
    })
  })

  it('should parse with skipNull as true', () => {
    const toParse = '?'
    const unquery = Unquery(
      toParse,
      { someNull: Unquery.string() },
      { skipNull: true }
    )

    expect(unquery).toEqual({})
  })

  it('should parse with skipUnknown as false', () => {
    const toParse = '?someValue=123&unknownQuery=456'
    const unquery = Unquery(
      toParse,
      { someValue: Unquery.string() },
      { skipUnknown: false }
    )

    expect(unquery).toEqual({
      someValue: '123',
      unknownQuery: '456'
    })
  })

  it('should parse with skipUnknown as true', () => {
    const toParse = '?someValue=123&unknownQuery=456'
    const unquery = Unquery(
      toParse,
      { someValue: Unquery.string() },
      { skipUnknown: true }
    )

    expect(unquery).toEqual({
      someValue: '123'
    })
  })

  it('should get new global config', () => {
    const toParse = '?foo[0]=bar&foo[1]=123&unknown=baz'
    setOptions({
      arrayFormat: 'index',
      skipUnknown: false
    })

    const unquery = Unquery(toParse, {})
    const unquery2 = Unquery(toParse, {
      // "Wrong" value to test compatibility with
      // another type. It should always get the last value
      foo: Unquery.string()
    })

    expect(unquery).toEqual({
      foo: ['bar', '123'],
      unknown: 'baz'
    })
    expect(unquery.stringify()).toBe('foo[0]=bar&foo[1]=123&unknown=baz')
    expect(unquery.stringify({ arrayFormat: 'comma' })).toBe(
      'foo=bar,123&unknown=baz'
    )
    expect(unquery.stringify({ arrayFormat: 'none' })).toBe(
      'foo=bar&foo=123&unknown=baz'
    )
    expect(unquery2).toEqual({
      foo: '123',
      unknown: 'baz'
    })
  })

  it('should respect default pattern', () => {
    const toParse = '?foo=2019-10-20'
    setOptions({ pattern: 'DD/MM/YYYY' })

    const unquery = Unquery(toParse, {
      foo: Unquery.date('YYYY-MM-DD')
    })
    const unquery2 = Unquery(toParse, {
      foo: Unquery.string()
    })

    expect(unquery.stringify()).toBe(`foo=20${bar}10${bar}2019`)
    expect(unquery2.stringify()).toBe('foo=2019-10-20')
  })

  it('should respect parse/encode pattern', () => {
    const toParse = '?foo=2019-24-07'
    setOptions({ parsePattern: 'YYYY-DD-MM', encodePattern: 'DD/MM/YYYY' })

    const unquery = Unquery(toParse, {
      foo: Unquery.date()
    })

    expect(unquery.stringify()).toBe(`foo=24${bar}07${bar}2019`)
  })
})
