import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PageConfig } from '@mie-js/core';
import { BundleRenderer } from 'vue-server-renderer';
import clone from 'clone-deep';
import webpack from 'webpack';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import { base } from '../conf/webpack.base';
import { getServerConfig } from '../conf/webpack.server';
import { getClientConfig } from '../conf/webpack.client';


export class Packer {
  private innerDist = join(__dirname, '../../innerDist');

  private serverConfig: WebpackOptions;
  private clientConfig: WebpackOptions;

  constructor(pageConfig: Required<PageConfig>) {
    // console.log('vue2-packer:', pageConfig);
    const { pageDir = '', route = '', template = ''} = pageConfig;

    const serverDist = join(this.innerDist, `./server${route}`);
    const clientDist = join(this.innerDist, `./client${route}`);

    if (!existsSync(serverDist)) {
      mkdirSync(serverDist, { recursive: true });
    }
    if (!existsSync(clientDist)) {
      mkdirSync(clientDist, { recursive: true });
    }

    this.serverConfig = getServerConfig(clone(base), {
      mode: 'development',
      entry: join(pageDir, './App.vue'),
      dist: serverDist,
      onProgress: (percentage: number, message: string) => {
        if (percentage === 1) {
          // todo
        }
      },
    });

    this.clientConfig = getClientConfig(clone(base), {
      mode: 'development',
      entry: join(pageDir, './App.vue'),
      dist: clientDist,
      onProgress: (percentage: number, message: string) => {
        if (percentage === 1) {
          // todo
        }
      },
    });

    // webpack(this.serverConfig).watch({}, (err, stats) => {
    //   if (err) {
    //     throw err;
    //   }
    //   const stat = stats.toJson();
    //   stat.errors.forEach((err) => console.error(err));
    //   stat.warnings.forEach((err) => console.warn(err));
    // });
  }

  getBuildingRender(): BundleRenderer {
    return {} as BundleRenderer;
  }
}
