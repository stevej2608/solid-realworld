import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command, mode }) => {
  console.log('command=[%s]', command)
  return {
    plugins: [
      solidPlugin()
    ],
    build: {
      sourcemap: ['serve', 'dev'].includes(command) ? true : true,
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
