import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

export interface ExternalConfig {
  mode: 'development' | 'production';
  entry: {
    app: string;
    entry?: string
  };
  dist: string;
  publicPath: string,
  onProgress: (percentage: number, message?: string) => void;
  hmrPath?: string,
}


export const base: WebpackOptions = {
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.json'],
    modules: module.paths,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
              optimizeSSR: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          esModule: false,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[contenthash:8].[ext]',
            },
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf|woff2)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 4096,
          esModule: false,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'font/[name].[contenthash:8].[ext]',
            },
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          esModule: false,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'media/[name].[contenthash:8].[ext]',
            },
          },
        },
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
