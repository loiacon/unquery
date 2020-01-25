import { Unquery, clearLocationURL, addLocationURL } from '..'
import { replaceLocationURL } from '../src/locationURL'

const url = 'https://unquery.com/current-url'

describe('addLocationURL', () => {
  afterEach(() => {
    clearLocationURL()
  })

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

  it('should clear and update while keep hash', () => {
    location.hash = 'foo'

    expect(location.href).toBe(`${url}${location.hash}`)

    addLocationURL('?foo=baz')

    expect(location.href).toBe(`${url}?foo=baz${location.hash}`)

    addLocationURL('bar=1')
    location.hash = ''

    expect(location.href).toBe(`${url}?foo=baz&bar=1${location.hash}`)

    replaceLocationURL('baz=42')

    expect(location.href).toBe(`${url}?baz=42${location.hash}`)
  })

  it('should update without remove hash', () => {
    location.hash = 'baz'

    expect(location.href.endsWith('#baz')).toBe(true)
    expect(location.search).toBe('')

    addLocationURL('bar=123')

    expect(location.search).toBe('?bar=123')
    expect(location.href.endsWith('?bar=123#baz')).toBe(true)
  })
})
