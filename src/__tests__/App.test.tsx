import { HTMLElement } from 'solid-js';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'
import { flushPromises } from './utils'

describe('Confirm Home page loads', () => {

  // Confirm stages of page load..

  it('Should see "Loading articles and then articles"', async () => {
    let result

    result = render(() => <AppMain />)
    expect(result).toBeTruthy()

    // Confirm Loading... is signaled to the user

    await waitFor(() =>
      expect(
        screen.queryByText('Loading articles...') &&
        screen.queryByText('Loading tags...')
      ).toBeTruthy())

    // Confirm we have the first 10 articles listed

    result = await screen.findAllByText('Anah Benešová')
    expect((result as HTMLElement[]).length).toBe(10)

    // Confirm we have ten global tags

    result = await screen.findAllByTestId ('tag-link')
    expect((result as HTMLElement[]).length).toBe(10)

    // Final snapshot

    result = await screen.findByTestId ('container')
    expect(result).toMatchSnapshot()

  })

})
