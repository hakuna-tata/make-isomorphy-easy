import webpack from 'webpack';
import { ExternalConfig } from './webpack.base';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
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
    },
  };

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
