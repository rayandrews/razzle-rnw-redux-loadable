/* eslint-disable */

const path = require('path');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const {
  injectBabelResolveModules,
  injectBabelInclude,
} = require('./util/babel-injector');

module.exports = {
  modify(defaultConfig, { target, dev }, webpack) {
    const config = defaultConfig;

    // config.module.rules = config.module.rules
    //   .filter(
    //     (rule) =>
    //       !(rule.test && rule.test.exec && rule.test.exec('./something.css'))
    //   )
    //   .filter(
    //     (rule) =>
    //       !(
    //         rule.test &&
    //         rule.test.exec &&
    //         rule.test.exec('./something.module.css')
    //       )
    //   );

    if (target === 'web') {
      return {
        ...config,
        plugins: [
          ...config.plugins,
          new ReactLoadablePlugin({
            filename: './build/react-loadable.json',
          }),
        ],
      };
    }

    // const extPlugin = require(require.resolve('extract-text-webpack-plugin'));
    // config.plugins = config.plugins.filter(w => !(w instanceof extPlugin));

    return config;
  },
};
