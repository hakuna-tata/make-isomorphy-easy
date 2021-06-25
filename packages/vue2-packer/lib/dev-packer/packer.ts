import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PageConfig } from '@mie-js/core';
import { BundleRenderer } from 'vue-server-renderer';
import clone from 'clone-deep';
import { fork } from 'child_process';
import webpack from 'webpack';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import { base } from '../conf/webpack.base';
import { getServerConfig } from '../conf/webpack.server';
import { getClientConfig } from '../conf/webpack.client';

export class Packer {
  private innerDist = join(__dirname, '../../innerDist');
  private devPort = 60129;

  private app: unknown;
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

    this.initDevServer();
  }

  private async initDevServer(): Promise<void> {
    await this.runDevServer();

    // this.initServerCompiler();
    this.initClientCompiler();
  }

  private runDevServer(): Promise<void> {
    return new Promise((resolve) => {
      if (this.app) return;

        const cp = fork(join(__dirname, './child'));

        cp.send({
          devPort: this.devPort
        });

        cp.on('message', (data: { app: unknown }) => {
          this.app = data.app;
          resolve();
        });
    })
  }

  private initServerCompiler() {
    webpack(this.serverConfig).watch({}, (err, stats) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      const stat = stats.toJson();
      // eslint-disable-next-line no-console
      stat.errors.forEach((err) => console.error(err));
      // eslint-disable-next-line no-console
      stat.warnings.forEach((err) => console.warn(err));
    });
  }

  private initClientCompiler() {
    const clientCompiler = webpack(this.clientConfig);

    clientCompiler.watch({}, (err, stats) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      const stat = stats.toJson();
      // eslint-disable-next-line no-console
      stat.errors.forEach((err) => console.error(err));
      // eslint-disable-next-line no-console
      stat.warnings.forEach((err) => console.warn(err));
    });
  }

  getBuildingRender(): BundleRenderer {
    return {} as BundleRenderer;
  }
}
