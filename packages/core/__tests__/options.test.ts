import Unquery, { setOptions } from '..'

describe('Unquery global options', () => {
  it('should respect global arrayFormat option', () => {
    setOptions({ arrayFormat: 'comma' })

    const toParse = 'arr=1,2,3'
    const unquery = Unquery(toParse, {
      arr: Unquery.array(Unquery.number())
    })

    expect(unquery).toEqual({ arr: [1, 2, 3] })
  })

  it('should respect local arrayFormat option', () => {
    setOptions({ arrayFormat: 'none' })

    const toParse = 'arr=1,2,3'
    const unquery = Unquery(
      toParse,
      {
        arr: Unquery.array(Unquery.number())
      },
      { arrayFormat: 'comma' }
    )
    expect(unquery).toEqual({ arr: [1, 2, 3] })
  })
})
