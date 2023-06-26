import { HTMLElement } from 'solid-js';
import { render, waitFor } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'

// https://testing-library.com/docs/react-testing-library/cheatsheet/
// https://testing-library.com/docs/guide-disappearance/

describe('Confirm Home page loads', () => {

  // Confirm stages of page load..

  it('1. Should see "Loading articles..." and then articles themselves', async () => {
    let result = undefined

    const screen = render(() => <AppMain />)

    expect(screen).toBeTruthy()

    // Confirm Loading... is signaled to the user

    await waitFor(() =>
      expect(
        screen.queryByText('Loading articles...') &&
        screen.queryByText('Loading tags...')
      ).toBeTruthy(), {timeout: 2000} )

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
