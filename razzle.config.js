/* eslint-disable */

const path = require('path');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

module.exports = {
  modify(config, { target, dev }, webpack) {
    // config.resolve.alias = {
    //   components: path.resolve('./src/App/components/'),
    //   containers: path.resolve('./src/App/containers/'),
    //   reducers: path.resolve('./src/App/reduces/'),
    //   actions: path.resolve('./src/App/actions/'),
    //   store: path.resolve('./src/App/store'),
    // };

    // Since RN web takes care of CSS, we should remove it for a #perf boost
    config.module.rules = config.module.rules
      .filter(
        (rule) =>
          !(rule.test && rule.test.exec && rule.test.exec('./something.css'))
      )
      .filter(
        (rule) =>
          !(
            rule.test &&
            rule.test.exec &&
            rule.test.exec('./something.module.css')
          )
      );

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
