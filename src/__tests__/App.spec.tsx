import { render, screen, waitForElementToBeRemoved } from '@solidjs/testing-library';
import { describe, expect, it, beforeAll, afterAll, afterEach } from 'vitest'

import { server } from '../../test/mock/serverSetup'

import { AppMain } from '../index'

export const flushPromises = (): Promise<Function> => {
  return new Promise(resolve => setImmediate(resolve));
}

// https://github.com/solidjs/solid-testing-library
// https://testing-library.com/docs/queries/about

beforeAll(() => {
  server.listen()
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Confirm Articles load', () => {
  let result

  beforeEach(() => {
    result = render(() => <AppMain />)
  })

  it('should mount', () => {
    expect(result).toBeTruthy()
  })

  // Confirm we see loading...

  it('should see "Loading articles..."', async () => {
    result = await screen.findByText('Loading articles...')
    expect(result).toBeTruthy()
  })

  // Confirm loading phase completes

  it('should see "Loading articles..." removed', async () => {
    await waitForElementToBeRemoved(() => screen.queryAllByText('Loading articles...'))
  })

  // Page should now be stable, check expected elements

  it('should see Global Feed', () => {
    result = screen.getAllByText('Global Feed')
    // console.log("", result.length)
    expect(result).toBeTruthy()
  })

  it('should see "Anah Benešov"', async () => {
    await flushPromises()
    result = await screen.findAllByText('Anah Benešová')
    expect(result.length).toBe(20)
    // screen.debug()
  })
})

describe('Confirm Tags load', () => {
  let result

  beforeEach(() => {
    result = render(() => <AppMain />)
  })

  it('should mount', () => {
    expect(result).toBeTruthy()
  })

  // Confirm we see loading...

  it('should see "Loading tags..."', async () => {
    result = await screen.findByText('Loading articles...')
    expect(result).toBeTruthy()
  })

  // Confirm loading phase completes

  // it('should see "Loading tags..." removed', async () => {
  //   await waitForElementToBeRemoved(() => screen.queryAllByText('Loading tags...'))
  // })

  // Page should now be stable, check expected elements
  // https://testing-library.com/docs/queries/bytestid/


  it('should see tags', async () => {
    await flushPromises()
    result = await screen.queryAllByTestId ('tag-link')
    expect(result.length).toBe(20)
  })

})
