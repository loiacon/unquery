import Unquery from '..'

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
})
