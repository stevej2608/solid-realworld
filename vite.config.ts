import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ command, mode }) => {
  console.log('command=[%s]', command)
  return {
    plugins: [

      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        // exclude: [
        //   'fs', // Excludes the polyfill for `fs` and `node:fs`.
        // ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
          settings: true
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),

      solidPlugin()

    ],
    build: {
      sourcemap: ['serve', 'dev'].includes(command) ? 'inline' : false,
      minify: ['serve', 'dev'].includes(command) ? false : true,
      target: 'esnext',
      chunkSizeWarningLimit: 510 * 1024,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {

              if (id.includes('apexcharts')) {
                return 'apexcharts';
              }

              return 'vendor';
            }
          },
        },
      },
    }
  }
})
