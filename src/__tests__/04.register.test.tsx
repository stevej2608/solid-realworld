import { HTMLElement } from 'solid-js';
import { render, waitFor, fireEvent } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { AppMain } from '../AppMain'

// https://testing-library.com/docs/react-testing-library/cheatsheet/
// https://testing-library.com/docs/guide-disappearance/

describe.only('Signup', () => {

  it('1. Sign Up', async () => {
    let result = undefined

    const screen = render(() => <AppMain />)
    expect(screen).toBeTruthy()

    await waitFor(() =>
      expect(
        screen.queryByText('Loading articles...') &&
        screen.queryByText('Loading tags...')
      ).toBeTruthy())

    // Click sign up nav-link

    result = await screen.findByText('Sign up')
    fireEvent.click(result)

    result = await screen.findByText((text) => text.includes('Have an account?'))
    expect(screen).toBeTruthy()


    const password = screen.getByLabelText('password')
    const name = screen.getByLabelText('username')
    const email = screen.getByLabelText('email')

    const button = screen.getByRole('button')

    fireEvent.change(name, { target: { value: 'Big Joe' } })
    fireEvent.change(email, { target: { value: 'bigjoe@gmail.com' } })
    fireEvent.change(password, { target: { value: 'mysecret' } })

    expect(name).toHaveValue('Big Joe')
    expect(email).toHaveValue('bigjoe@gmail.com')
    expect(password).toHaveValue('mysecret')

    fireEvent.click(button)

    await waitFor(() =>
      expect(
        screen.queryByText('New Post') &&
        screen.queryByText('Big Joe') &&
        screen.queryByText('Settings')
      ).toBeTruthy(), { timeout: 3000 })

  })

})
