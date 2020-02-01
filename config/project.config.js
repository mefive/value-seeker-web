const path = require('path');
const merge = require('webpack-merge');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const _ = require('lodash');

exports.useMisc = true;

const contextPath = '/';

exports.contextPath = contextPath;

exports.devServerProxy = [{
  context: ['/module', '/project/eoi'],
  target: 'http://eoi.test.sogou',
}];

exports.entries = [
  {
    name: 'main',
    src: './src/app/Main/index',
    template: './src/templates/main.html',
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

exports.webpackConfigOverrides = defaultConfig => {
  const config = _.cloneDeep(defaultConfig);

  _.remove(config.module.rules, rule => rule.test.toString() === /\.less/.toString());

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
                  'font-family': `"Helvetica Neue", "PingFangSC-Regular",
                  "Chinese Quote", -apple-system, BlinkMacSystemFont, 
                  "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 
                  Helvetica, Arial, sans-serif,
                  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,

                  'primary-color': '#7E8AEF',
                  'link-color': '#6E7DF9',
                  'menu-dark-bg': '#313350',
                  'menu-dark-submenu-bg': '#313350',
                  'menu-item-height': '56px',
                  'menu-inline-toplevel-item-height': '56px',
                  'menu-dark-item-active-bg': '#6F77AA',

                  'tree-child-padding': '12px',

                  'card-radius': '6px',

                  'heading-color': 'rgba(42, 42, 68, 1)',
                  'text-color': 'rgba(42, 42, 68, .8)',
                  'text-color-secondary': 'rgba(42, 42, 68, .6)',
                  'disabled-color': 'rgba(42, 42, 68, .3)',

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
