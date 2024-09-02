import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePluginRadar } from 'vite-plugin-radar'

export default defineConfig({
  root: process.cwd(),
  base: '/',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    include: [
      '@ckeditor/ckeditor5-vue',
      '@ckeditor/ckeditor5-build-classic',
      '@iconify/iconify',
      '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js',
      '@vee-validate/zod',
      '@vueuse/core',
      '@vueuse/head',
      '@vueform/multiselect',
      '@vueform/slider',
      'axios',
      'billboard.js',
      'dayjs',
      'dropzone',
      'dragula',
      'defu',
      'filepond',
      'filepond-plugin-file-validate-size',
      'filepond-plugin-file-validate-type',
      'filepond-plugin-image-exif-orientation',
      'filepond-plugin-image-crop',
      'filepond-plugin-image-edit',
      'filepond-plugin-image-preview',
      'filepond-plugin-image-resize',
      'filepond-plugin-image-transform',
      'imask',
      'nprogress',
      'notyf',
      'mapbox-gl',
      'photoswipe/lightbox',
      'photoswipe',
      'plyr',
      'v-calendar',
      'vee-validate',
      'vue',
      'vue-scrollto',
      'vue3-apexcharts',
      'vue-tippy',
      'vue-i18n',
      'vue-router',
      'unplugin-vue-router/runtime',
      'simplebar',
      'simple-datatables',
      'tiny-slider/src/tiny-slider',
      'vue-accessible-color-picker',
      'zod',
      '@stefanprobst/remark-shiki',
      'rehype-external-links',
      'rehype-raw',
      'rehype-sanitize',
      'rehype-stringify',
      'rehype-slug',
      'rehype-autolink-headings',
      'remark-gfm',
      'remark-parse',
      'remark-rehype',
      'shiki',
      'unified',
      'workbox-window',
      'textarea-markdown-editor/dist/esm/bootstrap',
    ],
  },

  build: {
    minify: 'terser',
    assetsInlineLimit: 4096 * 2,
  },

  plugins: [
    VueRouter({
      routesFolder: 'src/views',
      dts: true,
    }),
    Vue(),

    AutoImport({
      dts: true,
      imports: ['vue', '@vueuse/core', VueRouterAutoImports],
    }),

    Components({
      dirs: ['src/layouts','src/components'],
      extensions: ['vue'],
      deep: true, 
      dts: true,  
    }),
    
    
    /**
     * vite-plugin-radar plugin inject snippets from analytics providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-radar
     */
    !process.env.GTM_ID
      ? undefined
      : VitePluginRadar({
          gtm: {
            id: process.env.GTM_ID,
          },
        }),

  ],
  
})
