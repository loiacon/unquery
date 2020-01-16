import Unquery, { clearLocationURL, addLocationURL } from '..'

describe('addLocationURL', () => {
  const query = Unquery('?foo=bar', {
    foo: Unquery.string()
  })

  it('should be correct query', () => {
    expect(query).toEqual({ foo: 'bar' })
  })

  it('should update and apply callback', () => {
    location.hash = 'value'

    expect(location.search).toBe('')

    addLocationURL(query)

    expect(location.search).toBe('?foo=bar')
    expect(location.href).toContain('?foo=bar#value')
  })

  it('should update without remove hash', () => {
    location.hash = ''
    expect(location.href.endsWith('?foo=bar')).toBe(true)

    clearLocationURL()

    expect(location.search).toBe('')
  })
})
