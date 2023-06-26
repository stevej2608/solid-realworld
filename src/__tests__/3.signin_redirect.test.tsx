import { HTMLElement } from 'solid-js';
import { render, waitFor, fireEvent } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'

// https://testing-library.com/docs/react-testing-library/cheatsheet/
// https://testing-library.com/docs/guide-disappearance/

describe('Signin redirect', () => {

  // Confirm tag selection opens new tag feed

  it('1. Should see clicking on tag selects a new feed', async () => {
    let result = undefined

    const screen = render(() => <AppMain />)

    expect(screen).toBeTruthy()

    // Confirm we have ten global tags

    result = await screen.findAllByTestId ('tag-link')
    expect((result as HTMLElement[]).length).toBe(10)

    result = await screen.findByTestId ('container')
    expect(result).toMatchSnapshot()

    fireEvent.click(screen.getByText('welcome'))

    await waitFor(() =>
      expect(
        screen.queryByText('Welcome to RealWorld project')
      ).toBeTruthy(), {timeout: 2000} )

    // Final snapshot

    result = await screen.findByTestId ('container')
    expect(result).toMatchSnapshot()

  })

})
