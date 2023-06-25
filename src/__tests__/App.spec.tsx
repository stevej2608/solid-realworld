import { render, screen, waitFor } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'

describe('Confirm Home page loads', () => {

  // Confirm stages of page load..

  it('should see "Loading articles and then articles"', async () => {
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
    expect(result.length).toBe(10)

    // Confirm we have ten global tags

    result = await screen.findAllByTestId ('tag-link')
    expect(result.length).toBe(10)

  })

})
