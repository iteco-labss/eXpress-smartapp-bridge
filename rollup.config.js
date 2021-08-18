import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'build/module/index.js',
  output: {
    dir: 'build/umd',
    name: 'SmartAppBridge',
    format: 'umd',
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
  ],
}
