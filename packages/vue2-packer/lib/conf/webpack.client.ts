import webpack from 'webpack';
import { ExternalConfig } from './webpack.base';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import  { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';

export const getClientConfig = (base: WebpackOptions, options: ExternalConfig): WebpackOptions => {
  const isDev = options.mode === 'development';

  const config: WebpackOptions = {
    ...base,
    mode: options.mode,
    entry: {
      app: options.entry,
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : '',
    output: {
      filename: isDev ? '[name].js' : '[name]/app.[contenthash:4].js',
      path: options.dist,
      library: 'mieApp',
      libraryTarget: 'umd2',
      libraryExport: 'default',
    },
  };

  config.module.rules.push(
    {
      test: /\.(ts|js)x?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['ios >= 9', 'Android >= 6.0'],
                  }
                },
              ],
              '@babel/preset-typescript',
            ]
          }
        }
      ],
    },
    {
      test: /\.css$/,
      use: [isDev ? 'vue-style-loader' : MiniCssExtractLoader, 'css-loader'],
    },
    {
      test: /\.less$/,
      use: [isDev ? 'vue-style-loader' : MiniCssExtractLoader, 'css-loader', 'less-loader'],
    },
  );

  config.plugins.push(
    new VueSSRClientPlugin({
      filename: 'mie-vue2-client-manifest.json',
    }),
  );

  if (isDev) {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.ProgressPlugin(options.onProgress),
    );
  }

  return config;
}
