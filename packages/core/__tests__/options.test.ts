import Unquery, { setOptions } from '..'
import { unqueryOptions } from '../src/unqueryOptions'

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

  it('should maintain global option', () => {
    setOptions({ arrayFormat: 'none' })

    expect(unqueryOptions.arrayFormat).toBe('none')

    const query = Unquery(
      'foo[]=1&foo[]=2',
      {
        foo: Unquery.array(Unquery.number())
      },
      {
        arrayFormat: 'bracket'
      }
    )

    expect(query).toEqual({ foo: [1, 2] })
    expect(unqueryOptions.arrayFormat).toBe('none')
  })
})
