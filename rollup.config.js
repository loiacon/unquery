import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'packages/core/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.es.js',
      format: 'es'
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'Unquery'
    },
    {
      file: 'dist/index.js',
      format: 'iife',
      name: 'Unquery'
    }
  ],
  plugins: [terser(), typescript({ clean: true })]
}
