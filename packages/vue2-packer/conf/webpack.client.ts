import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';

export const getClientConfig = (base: WebpackOptions, options): WebpackOptions => {
  const config: WebpackOptions = {
    ...base,
  };

  return config;
}
