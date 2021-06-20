import webpack from 'webpack';
import { ExternalConfig } from './webpack.base';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import nodeExternals from 'webpack-node-externals';

export const getServerConfig = (base: WebpackOptions, options: ExternalConfig): WebpackOptions => {
  const isDev = options.mode === 'development';

  const config: WebpackOptions = {
    ...base,
    target: 'node',
    mode: options.mode,
    entry: {
      app: options.entry,
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : '',
    output: {
      filename: isDev ? '[name].js' : '[name]/app.js',
      path: options.dist,
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals(),],
  };

  if (isDev) {
    config.plugins.push(new webpack.ProgressPlugin(options.onProgress));
  }

  return config;
}
