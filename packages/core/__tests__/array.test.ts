import Unquery from '..'

describe('Unquery array parser', () => {
  it('should parse array', () => {
    const toParse = '?someArray=1,2,3&someOtherArray=1,2,3'
    const unquery = Unquery(
      toParse,
      {
        someArray: Unquery.array(Unquery.number()),
        someOtherArray: Unquery.array(Unquery.string())
      },
      { arrayFormat: 'comma' }
    )

    expect(unquery).toEqual({
      someArray: [1, 2, 3],
      someOtherArray: ['1', '2', '3']
    })
  })

  it('should parse array with Unquery.string as default inner value', () => {
    const toParse = '?foo[0]=1&foo[1]=2'
    const unquery = Unquery(
      toParse,
      {
        foo: Unquery.array()
      },
      { arrayFormat: 'index' }
    )

    expect(unquery).toEqual({
      foo: ['1', '2']
    })
  })

  it('should parse array with another values', () => {
    const toParse = '?someArray=1,2,3&someValue=foo&someBool=true&unknown=bar'
    const unquery = Unquery(
      toParse,
      {
        someArray: Unquery.array(Unquery.number()),
        someValue: Unquery.string(),
        someBool: Unquery.bool()
      },
      {
        arrayFormat: 'comma'
      }
    )

    expect(unquery).toEqual({
      someArray: [1, 2, 3],
      someValue: 'foo',
      someBool: true
    })
  })

  it('should work with date', () => {
    const toParse = '?date=2020-01-01,2020-02-01'
    const unquery = Unquery(
      toParse,
      {
        date: Unquery.array(Unquery.date('YYYY-MM-DD'))
      },
      { arrayFormat: 'comma' }
    )

    expect(unquery).toEqual({
      date: [new Date('2020-01-01'), new Date('2020-02-01')]
    })
    expect(unquery.stringify({ arrayFormat: 'index' })).toBe(
      'date[0]=2020-01-01&date[1]=2020-02-01'
    )
    expect(unquery.stringify({ arrayFormat: 'comma' })).toBe(
      'date=2020-01-01,2020-02-01'
    )
  })

  it('should stringify array', () => {
    const toParse = '?bracketArray[]=1&bracketArray[]=2'
    const unquery = Unquery(
      toParse,
      {
        bracketArray: Unquery.array(Unquery.number())
      },
      { arrayFormat: 'bracket' }
    )

    expect(unquery).toEqual({
      bracketArray: [1, 2]
    })

    expect(unquery.stringify({ arrayFormat: 'comma' })).toBe('bracketArray=1,2')
    expect(unquery.stringify({ arrayFormat: 'none' })).toBe(
      'bracketArray=1&bracketArray=2'
    )
    expect(unquery.stringify({ arrayFormat: 'bracket' })).toBe(
      'bracketArray[]=1&bracketArray[]=2'
    )
    expect(unquery.stringify({ arrayFormat: 'index' })).toBe(
      'bracketArray[0]=1&bracketArray[1]=2'
    )
  })

  it('should parse unknown array', () => {
    const toParse = '?nullArray[]=1&nullArray[]=2'

    const unquery = Unquery(
      toParse,
      {},
      { arrayFormat: 'bracket', skipUnknown: false }
    )

    expect(unquery).toEqual({ nullArray: ['1', '2'] })
  })

  it('should parse arrayFormat none', () => {
    const toParse = 'foo=1&foo=2&foo=3'
    const unquery = Unquery(
      toParse,
      {
        foo: Unquery.array(Unquery.number())
      },
      { arrayFormat: 'none' }
    )

    expect(unquery).toEqual({ foo: [1, 2, 3] })
  })

  it('should array work with falsy values', () => {
    const toParse = 'foo&foo=true&bar=&bar=0&baz=&baz=foo&baz'
    const query = Unquery(toParse, {
      foo: Unquery.array(Unquery.bool()),
      bar: Unquery.array(Unquery.number()),
      baz: Unquery.array(Unquery.string())
    })

    expect(query).toEqual({
      foo: [null, true],
      bar: [null, 0],
      baz: ['', 'foo', null]
    })
  })
})
