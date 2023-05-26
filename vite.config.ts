import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command }) => {
  console.log('command=%s', command)
  return {
    plugins: [solidPlugin()],
    esbuild: {
      loader: 'jsx',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
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
