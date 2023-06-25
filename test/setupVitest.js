import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest';
// import { server } from './mock/serverSetup'
import { server } from './mock/mockFetch'

// The browser-logger if enables causes weird errors. This
// hack is tested prior to enabling the logger

window.name = "JSDOM"
