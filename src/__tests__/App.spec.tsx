import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { describe, expect, it, beforeAll, afterAll, afterEach } from 'vitest'

import { server } from '../../test/mock/serverSetup'

import { AppMain } from '../index'
import { logger, LogLevel } from '../../src/utils/logger'

beforeAll(() => {
  server.listen()
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('real-world', () => {
  let wrapper

  beforeEach(() => {
    wrapper = render(() => <AppMain />)
  })

  it('should mount', () => {
    expect(wrapper).toBeTruthy()
  })

  // https://vitest.dev/guide/features.html#snapshot

  // it('should mount', async () => {
  //   const wrapper = await render(() => <AppMain/>);

  //   await new Promise(process.nextTick);

  //   expect(wrapper).toBeTruthy();

  //   await waitFor(() => {
  //     const banner = screen.getAllByText('A place to share your knowledge.')
  //     expect(banner.length).toBe(2)
  //   })

  // });

  it('should render header', async () => {
    await waitFor(() => {
      const banner = screen.getAllByText('A place to share your knowledge.')
      expect(banner.length).toBe(2)
    })
  })
})
