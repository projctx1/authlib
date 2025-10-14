import { defineConfig } from 'rollup'
import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

export default defineConfig([
  // Full SDK build
  {
    input: 'client/src/index.js',
    output: {
      file: 'client/dist/vue-auth-sdk.es.js',
      format: 'es'
    },
    external: ['vue', 'vuex', 'vue-router', 'axios'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      vue(),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      terser()
    ]
  },

  // CommonJS build
  {
    input: 'client/src/index.js',
    output: {
      file: 'client/dist/vue-auth-sdk.cjs.js',
      format: 'cjs'
    },
    external: ['vue', 'vuex', 'vue-router', 'axios'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      vue(),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      terser()
    ]
  },

  // Components only build
  {
    input: 'client/src/components-only.js',
    output: {
      file: 'client/dist/components-only.es.js',
      format: 'es'
    },
    external: ['vue', 'vuex', 'vue-router'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      vue(),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      terser()
    ]
  },

  // Composables only build
  {
    input: 'client/src/composables-only.js',
    output: {
      file: 'client/dist/composables-only.es.js',
      format: 'es'
    },
    external: ['vue', 'vuex'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      terser()
    ]
  }
])