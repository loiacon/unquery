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
})
