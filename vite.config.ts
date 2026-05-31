import { fileURLToPath } from 'node:url'
import { unheadVueComposablesImports as unheadImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver as naiveUiResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { getPascalCaseRouteName, VueRouterAutoImports as routerImports } from 'unplugin-vue-router'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolvePath('src'),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    vueRouter({
      routesFolder: ['src/views'],
      dts: 'src/router.d.ts',
      exclude: ['**/components/**/*'],
      importMode: 'async',
      routeBlockLang: 'yaml',
      getRouteName: routeNode => getPascalCaseRouteName(routeNode),
    }),

    vue({
      script: {
        propsDestructure: true,
        defineModel: true,
      },
    }),

    // https://unocss.dev/
    unocss(),

    // https://github.com/vbenjs/vite-plugin-compression
    compression({}),

    // https://github.com/unplugin/unplugin-auto-import
    autoImport({
      dts: 'src/imports.d.ts',
      dirs: [
        'src/composables',
        'src/requests',
        'src/shared',
        'src/stores',
        'src/context',
        'src/constant',
      ],
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        { 'vue-request': ['useRequest', 'usePagination'] },
        routerImports,
        unheadImports,
      ],
      vueTemplate: true,
    }),

    // https://github.com/unplugin/unplugin-vue-components
    components({
      dts: 'src/components.d.ts',
      globs: ['src/components/**/*.vue'],
      resolvers: [
        naiveUiResolver(),
      ],
    }),
  ],
})
