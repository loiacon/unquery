import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'packages/core/index.ts',
  output: [
    {
      file: `dist/${pkg.name}.umd.js`,
      format: 'umd',
      name: 'Unquery'
    },
    {
      file: `dist/${pkg.name}.esm.js`,
      format: 'es'
    },
    {
      file: `dist/${pkg.name}.cjs.js`,
      format: 'cjs',
      exports: 'named'
    },
    {
      file: `dist/${pkg.name}.iife.js`,
      format: 'iife',
      name: 'Unquery'
    }
  ],
  plugins: [terser(), typescript({ clean: true })]
}
