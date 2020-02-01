/* eslint-env node */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const express = require('express');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const {
  contextPath, entries,
  outputPath, devOutputPath, staticPath,
  useMisc,
  devServerPort, devServerProxy,
  dllEntry,
  webpackConfigOverrides,
} = require('./config/merged.config.js');

module.exports = function webpackConfig(env, argv) {
  // 在devops.ted.sogou部署环境下会注入package和version环境变量，根据此环境变量生成misc服务的publicPath。
  const packageName = process.env.package && process.env.package.trim();
  const version = process.env.version && process.env.version.trim();
  console.log('packageName:', packageName);
  console.log('version:', version);
  const { buildTarget = 'app' } = env || {};
  const { mode = 'development' } = argv || {};
  const isDev = mode === 'development';

  let publicPath;
  if (!isDev && useMisc && packageName && version) {
    publicPath = `https://misc.sogou-inc.com/app/${packageName}/${version}/`;
  } else {
    publicPath = contextPath;
  }

  const buildRootPath = path.join(__dirname, isDev ? devOutputPath : outputPath);
  console.log('buildRootPath:', buildRootPath);
  // const buildStaticPath = path.join(buildRootPath, staticPath);
  const buildDllPath = path.join(buildRootPath, 'dll');

  if (buildTarget === 'dll') {
    if (dllEntry && Object.keys(dllEntry).length > 0) {
      return {
        entry: dllEntry,
        output: {
          filename: 'dll/[name].[chunkhash].dll.js',
          path: buildRootPath,
          library: '[name]_lib',
        },
        plugins: [
          new CleanWebpackPlugin(),
          new webpack.DllPlugin({
            path: path.posix.join(buildDllPath, '[name]-manifest.json'),
            name: '[name]_lib',
          }),
          new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
        ],
      };
    }

    return {
      plugins: [
        new CleanWebpackPlugin(),
      ],
    };
  }

  const dlls = [];
  // const dllManifests = [];
  const dllPlugins = [];
  if (fs.existsSync(buildDllPath)) {
    fs.readdirSync(buildDllPath).forEach(file => {
      if (file.indexOf('dll.') >= 0) {
        dlls.push(publicPath + path.posix.join('dll', file));
      }
      if (file.endsWith('manifest.json')) {
        // dllManifests.push(file);
        dllPlugins.push(new webpack.DllReferencePlugin({
          context: '.',
          // eslint-disable-next-line import/no-dynamic-require,global-require
          manifest: require(path.posix.join(buildDllPath, file)),
        }));
      }
    });
  }

  // 多入口的entry、HtmlWebpackPlugin、devServer.historyApiFallback的配置
  const entry = {};
  const htmlPlugins = [];
  const rewrites = [];
  entries.forEach(item => {
    let name;
    let src;
    let html;
    let template;
    let basePath;
    if (typeof item === 'string') {
      name = item;
    } else {
      ({
        name, src, html, template, basePath,
      } = item);
    }
    if (!src) {
      src = `./src/app/${name}`;
    }
    if (!html && html !== false) {
      html = `${name}.html`;
    }
    if (!template) {
      template = './src/templates/index.html';
    }
    if (!basePath) {
      basePath = name;
    }
    entry[name] = src;
    if (html !== false) {
      htmlPlugins.push(new HtmlWebpackPlugin({
        minify: false,
        template,
        dlls,
        publicPath,
        filename: html,
        chunks: [name],
        inject: item.inject == null ? true : item.inject,
      }));
      rewrites.push({
        from: new RegExp(`^${path.posix.join(contextPath, basePath)}`),
        to: path.posix.join(contextPath, html),
      });
    }
  });

  const proxy = devServerProxy.map(({ context, target }) => ({
    context,
    target,
    secure: false,
    changeOrigin: true,
    xfwd: true,
    cookieDomainRewrite: {
      '*': '',
    },
  }));

  const config = {
    entry,

    output: {
      filename: path.posix.join(staticPath, 'js', '[name].[hash:7].js'),
      chunkFilename: path.posix.join(staticPath, 'js', '[name].[chunkhash:7].chunk.js'),
      path: buildRootPath,
      publicPath,
    },

    module: {
      rules: [
        {
          test: /\.([jt])sx?$/,
          exclude: [/node_modules/],
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          ],
        },
        {
          test: /\.less/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                //  modifyVars: pacakgeJson.antdTheme
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'images'),
                publicPath: publicPath + path.posix.join(staticPath, 'images'),
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'fonts'),
                publicPath: publicPath + path.posix.join(staticPath, 'fonts'),
              },
            },
          ],
        },
        {
          test: /\.(rar|jar|zip|pdf|md)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'files'),
                publicPath: publicPath + path.posix.join(staticPath, 'files'),
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    plugins: [
      new webpack.EnvironmentPlugin({ NODE_ENV: mode }),

      new webpack.DefinePlugin({
        webpackConfig: JSON.stringify({ publicPath, contextPath }),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),

      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[hash:7].css',
        chunkFilename: 'static/css/[id].css',
      }),

      ...dllPlugins,

      ...htmlPlugins,

      // new BundleAnalyzerPlugin(),
    ],

    devtool: mode === 'development' ? 'source-map' : false,

    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true,
      port: devServerPort,
      inline: true,
      hot: true,
      open: false,
      compress: true,
      // contentBase: buildRootPath,
      publicPath,
      before(app) {
        app.use(contextPath, express.static(buildRootPath));
      },
      historyApiFallback: {
        rewrites,
      },
      proxy,
    },
  };

  if (webpackConfigOverrides) {
    return webpackConfigOverrides(config);
  }

  return config;
};
