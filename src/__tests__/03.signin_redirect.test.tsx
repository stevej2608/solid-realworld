import { HTMLElement } from 'solid-js';
import { render, waitFor, fireEvent } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'

// https://testing-library.com/docs/react-testing-library/cheatsheet/
// https://testing-library.com/docs/guide-disappearance/

// Clicking a favorite badge when not logged should result in a
// redirect to th signin page

describe('Favorite badge click - redirect to signin page', () => {

  it('1. Should redirect when favorite is clicked', async () => {
    let result = undefined

    const screen = render(() => <AppMain />)
    expect(screen).toBeTruthy()

    // Confirm we have the first 10 articles listed

    result = await screen.findAllByText('Anah Benešová')
    expect((result as HTMLElement[]).length).toBe(10)

    // First article has 1452 likes, click it!

    const favorite = await screen.findByText((text) => text.includes('1452'))
    fireEvent.click(favorite)

    // We're not signed-in so a redirect to the signin page is expected

    await waitFor(() =>
      expect(
        screen.queryByText('Sign in')
      ).toBeTruthy())

    // Final snapshot

    result = await screen.findByTestId ('container')
    expect(result).toMatchSnapshot()

  })

})
