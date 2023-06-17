import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ command, mode }) => {
  console.log('command=[%s]', command)
  return {
    plugins: [
      nodePolyfills(),
      solidPlugin()
    ],
    build: {
      sourcemap: ['serve', 'dev'].includes(command) ? true : true,
      minify: ['serve', 'dev'].includes(command) ? false : false,
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
