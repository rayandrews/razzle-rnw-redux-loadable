const path = require('path');
const autoprefixer = require('autoprefixer');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');

module.exports = {
  modify(defaultConfig, { target, dev }) {
    const config = Object.assign({}, defaultConfig);
    const isServer = target !== 'web';

    const postCssLoader = {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          PostCssFlexBugFixes,
          autoprefixer({
            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
            flexbox: 'no-2009',
          }),
        ],
      },
    };

    const sassLoader = {
      loader: require.resolve('sass-loader'),
      options: {
        includePaths: [path.resolve(__dirname, 'node_modules')],
      },
    };

    /* eslint-disable */
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.scss$/,
        use: isServer
          ? [require.resolve('css-loader'), sassLoader]
          : dev
            ? [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: { modules: false, sourceMap: true },
                },
                postCssLoader,
                sassLoader,
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: false,
                    minimize: true,
                  },
                },
                postCssLoader,
                sassLoader,
              ],
      },
    ];
    /* eslint-enable */

    if (target === 'web') {
      config.plugins = [
        ...config.plugins,
        new ReactLoadablePlugin({
          filename: './build/react-loadable.json',
        }),
      ];
    }

    config.resolve.modules.push('src');
    config.devtool = dev ? 'eval-source-map' : 'none';

    if (!isServer && !dev) {
      config.optimization.minimizer = [
        ...config.optimization.minimizer,
        new OptimizeCSSAssetsPlugin({}),
      ];
    }

    return config;
  },
};
