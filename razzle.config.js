const path = require('path');
const autoprefixer = require('autoprefixer');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const envDefinition = (target) => {
  const env = {
    __SERVER__: true,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
  };

  if (target === 'web') {
    return Object.assign({}, env, {
      __SERVER__: false,
    });
  }

  return Object.assign({}, env, {
    __CLIENT__: false,
  });
};

module.exports = {
  modify(defaultConfig, { target, dev }, webpack) {
    const config = Object.assign({}, defaultConfig);
    const isServer = target !== 'web';

    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin(envDefinition(target)),
    ];

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

    config.resolve.modules = [...config.resolve.modules, 'src'];

    if (!isServer) {
      config.plugins = [
        ...config.plugins,
        new ReactLoadablePlugin({
          filename: './build/react-loadable.json',
        }),
      ];

      if (!dev) {
        config.optimization.minimizer = [
          ...config.optimization.minimizer,
          new OptimizeCSSAssetsPlugin({}),
        ];
      } else {
        config.plugins = [
          ...config.plugins,
          // new BundleAnalyzerPlugin(),
          new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
              messages: ['You application is running'],
              notes: ['Hot reloading enabled!'],
            },
            // should the console be cleared between each compilation?
            // default is true
            clearConsole: true,

            // add formatters and transformers (see below)
            additionalFormatters: [],
            additionalTransformers: [],
          }),
        ];
      }
    }

    config.plugins = [
      ...config.plugins,
      new LodashModuleReplacementPlugin({
        collections: true,
        shorthands: true,
      }),
    ];

    if (!dev) {
      config.plugins = [
        ...config.plugins,
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        new webpack.NoErrorsPlugin(),
      ];
    }

    return Object.assign({}, config, {
      devtool: dev ? 'eval-source-map' : 'none',
    });
  },
};
