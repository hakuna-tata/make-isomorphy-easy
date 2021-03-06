import webpack from 'webpack';
import { ExternalConfig } from './webpack.base';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import nodeExternals from 'webpack-node-externals';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';

export const getServerConfig = (base: WebpackOptions, options: ExternalConfig): WebpackOptions => {
  const isDev = options.mode === 'development';

  const config: WebpackOptions = {
    ...base,
    target: 'node',
    mode: options.mode,
    entry: {
      entry: options.entry.entry,
      app: options.entry.app,
    },
    output: {
      filename: isDev ? 'server.[name].js' : 'server.app.[contenthash:4].js',
      path: options.dist,
      publicPath: options.publicPath,
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals(),],
  };

  config.module.rules.push(
    {
      test: /\.(ts|js)x?$/,
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            { targets: { node: '10' } }
          ],
          '@babel/preset-typescript',
        ],
      },
    },
    {
      test: /\.css$/,
      use: ['null-loader'],
    },
    {
      test: /\.less$/,
      use: ['null-loader'],
    },
  );

  config.plugins.push(
    new VueSSRServerPlugin({
      filename: 'mie-vue2-server-bundle.json'
    }),
  );

  if (isDev) {
    config.plugins.push(new webpack.ProgressPlugin(options.onProgress));
  }

  return config;
}
