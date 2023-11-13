import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
//import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import vueJsx from "@vitejs/plugin-vue-jsx";
import topLevelAwait from 'vite-plugin-top-level-await'

const config = ({ mode }) => {
  const isProd = mode === 'production'
  const envPrefix = 'APP_'
  const { APP_TITLE = '' } = loadEnv(mode, process.cwd(), envPrefix)
  return {
    plugins: [
      vue(),
      vueJsx(),
      // createHtmlPlugin({
      //   minify: isProd,
      //   inject: {
      //     data: {
      //       title: APP_TITLE,
      //     },
      //   }
      // })
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      })
    ],
    build: {
      //chunkSizeWarningLimit: 1500,
      target: 'es2015',
      outDir: path.resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      sourcemap: !isProd,
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          // assetFileNames: "assets/[name].[hash].[ext]",
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        }
      }
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: `${path.resolve(__dirname, 'src')}/` },
        { find: /^~/, replacement: '' }
      ],
      extensions: ['.js', '.mjs', '.vue', '.json', '.less', '.css']
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer
        ],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variable.less')}";`
        }
      }
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      },
      port: 6173
    },
    preview: {
      port: 5000
    },
    esbuild: { loader: { '.js': '.jsx' } },
  }
}

export default defineConfig(config)
