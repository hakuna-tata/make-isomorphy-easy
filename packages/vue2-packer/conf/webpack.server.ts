import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import nodeExternals from 'webpack-node-externals';

export const getServerConfig = (base: WebpackOptions, options): WebpackOptions => {
  const config: WebpackOptions = {
    ...base,
  };

  return config;
}
