const babel = require('rollup-plugin-babel')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const { terser } = require('rollup-plugin-terser')

const env = process.env.NODE_ENV

const config = {
  input: 'src/index.js',
  external: ['react'],
  output: {
    name: 'react-auth-wrapper',
    exports: 'named',
    indent: false,
    file: 'build/dist/react-auth-wrapper.js',
    format: 'umd',
    globals: {
      react: 'React'
    }
  },
  plugins: [
    commonjs({
      include: ['node_modules/hoist-non-react-statics/**']
    }),
    nodeResolve({ jsnext: true }),
    babel({ exclude: 'node_modules/**' }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(env) })
  ]
}

if (env === 'production') {
  config.output.file = 'build/dist/react-auth-wrapper.min.js'
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

module.exports = config
