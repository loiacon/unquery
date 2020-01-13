import Unquery from '..'

describe('Unquery', () => {
  it('should parse primitives', () => {
    const toParse = '?email=someone@example.com&userId=123'
    const unquery = Unquery(toParse, {
      email: Unquery.string(),
      userId: Unquery.number()
    })

    expect(unquery).toEqual({
      email: 'someone@example.com',
      userId: 123
    })
  })

  it('should parse date', () => {
    const toParse = '?isoDate=2020-01-01'
    const unquery = Unquery(toParse, { isoDate: Unquery.date() })

    expect(unquery).toEqual({
      isoDate: new Date('2020-01-01')
    })

    const toParse2 = '?isoDate=2020-01-01T04:30:00'
    const unquery2 = Unquery(toParse2, {
      isoDate: Unquery.date('YYYY-MM-DDTHH:mm:ss')
    })
    expect(unquery2).toEqual({
      isoDate: new Date('2020-01-01T04:30:00.000Z')
    })
    expect(unquery2.stringify()).toBe('isoDate=2020-01-01')
    expect(unquery2.stringify({ pattern: 'DD/MM/YYYY' })).toBe(
      'isoDate=01/01/2020'
    )
    expect(unquery2.stringify({ pattern: 'YYYY-MM-DD HH:mm:ss' })).toBe(
      'isoDate=2020-01-01 04:30:00'
    )
  })

  it('should stringify multiple values', () => {
    const toParse =
      '?email=foo@mail.com&userId=4&arr=foo,bar,baz&open=true&startDate=2020-01-01&unknown=bar'
    const unquery = Unquery(
      toParse,
      {
        email: Unquery.string(),
        userId: Unquery.number(),
        arr: Unquery.array(),
        open: Unquery.bool(),
        startDate: Unquery.date()
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
      startDate: new Date('2020-01-01')
    })
    expect(unquery.stringify({ arrayFormat: 'comma' })).toBe(
      'email=foo@mail.com&userId=4&arr=foo,bar,baz&open=true&startDate=2020-01-01'
    )
  })
})
