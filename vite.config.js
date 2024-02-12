import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '~': '/src',
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "~/styles/colors.scss";@import "~/styles/constants.scss";'
      }
    }
  },
  server: {
    proxy: {
      '/users': {
        target: 'https://infinite-users-service-test.canadacentral.cloudapp.azure.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users/, '')
      }
    }
  }
})
