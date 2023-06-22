import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { AppMain } from './index'

describe('real-world', () => {

  it('should mount', async () => {
    const wrapper = await render(() => <AppMain/>);
    expect(wrapper).toBeTruthy();
  });


});