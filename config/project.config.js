const path = require('path');
const merge = require('webpack-merge');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const _ = require('lodash');

exports.useMisc = true;

const contextPath = '/';

exports.contextPath = contextPath;

exports.devServerProxy = [{
  context: ['/api'],
  target: 'http://localhost:3000',
}];

exports.entries = [
  {
    name: 'main',
    src: './src/app/Main/index',
    template: './src/templates/index.html',
  },
];

exports.dllEntry = {
  polyfill: [
    'core-js/stable',
    'regenerator-runtime/runtime',
  ],
  vendor: [
    'moment',
    'axios',
  ],
  react: [
    'react',
    'react-dom',
    'prop-types',
    'react-router-dom',
    'mobx',
    'mobx-react',
  ],
};

exports.webpackConfigOverrides = (defaultConfig) => {
  const config = _.cloneDeep(defaultConfig);

  _.remove(config.module.rules, (rule) => rule.test.toString() === /\.less/.toString());

  return merge(config, {
    module: {
      rules: [
        {
          test: /\.less/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: {
                  'zindex-modal': 1001,
                  'zindex-modal-mask': 1001,
                },
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve('src'),
      },
    },

    devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: /^\/(?!dll)/,
            to: path.posix.join(contextPath, 'main.html'),
          },
        ],
      },
      inline: false,
      hot: true,
    },

    plugins: [
      new LodashModuleReplacementPlugin({
        cloning: true,
        paths: true,
        caching: true,
        shorthands: true,
      }),
    ],
  });
};
