/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command, mode }) => {
  console.log('command=[%s]', command)
  return {
    plugins: [
      solidPlugin()
    ],
    base: './',
    build: {
      sourcemap: ['serve', 'dev'].includes(command) ? true : true,
      minify: ['serve', 'dev'].includes(command) ? false : true,
    },
    test: {
      globals: true,
      transformMode: { web: [/\.[jt]sx?$/] },
      include: ['./src/**/*.test.{js,ts,jsx,tsx}'],
      environment: 'jsdom',
      setupFiles: [
        './test/setupVitest.js'
      ],
      deps: {
        inline: [/solid-js/, /solid-testing-library/],
      },
    },
  }
})
