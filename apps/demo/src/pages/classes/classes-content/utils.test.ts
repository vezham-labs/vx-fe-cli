import { describe, expect, it } from 'vitest'

import { initialClasses } from './data'
import { matchesClassSearch } from './utils'

describe('matchesClassSearch', () => {
  it.each([
    ['C138038', 'C138038'],
    ['ii', 'C138036'],
    ['b', 'C138037'],
    ['inactive', 'C138034']
  ])('matches a class by %s', (query, id) => {
    const classRecord = initialClasses.find(record => record.id === id)

    expect(classRecord).toBeDefined()
    if (!classRecord) throw new Error(`Class ${id} was not found.`)

    expect(matchesClassSearch(classRecord, query)).toBe(true)
  })

  it('does not match unrelated class values', () => {
    expect(matchesClassSearch(initialClasses[0], 'history')).toBe(false)
  })
})
