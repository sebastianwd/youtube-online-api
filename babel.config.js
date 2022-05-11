/* eslint-disable */
const fp = require('lodash/fp')
const { compilerOptions } = require('./tsconfig.json')

const pathAliases = fp.flow(
  fp.mapValues(fp.head),
  fp.toPairs,
  fp.map(fp.map(fp.replace('/*', ''))),
  fp.fromPairs,
)(compilerOptions.paths)

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['module-resolver', { root: '.', alias: pathAliases }],
    'babel-plugin-transform-typescript-metadata',
  ],
}
