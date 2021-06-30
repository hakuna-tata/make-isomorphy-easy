import { join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { Duplex } from 'stream';
import { PageConfig } from '@mie-js/core';
import { BundleRenderer } from 'vue-server-renderer';
import clone from 'clone-deep';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Koa from 'koa';
import serve from 'koa-static';
import webpack, { Configuration } from 'webpack';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import ejs from 'ejs';
import { base } from '../conf/webpack.base';
import { getServerConfig } from '../conf/webpack.server';
import { getClientConfig } from '../conf/webpack.client';
import { getServerTemplate } from './template';

const buildingEjs = readFileSync(join(__dirname, '../../ejs/building.ejs'), 'utf-8');
const defalutTemplate = readFileSync(join(__dirname, '../../template.html'), 'utf-8');

export class Packer {
  private innerDist = join(__dirname, '../../innerDist');
  private devServer: Koa;
  private devPort = 60129;
  private route = '';
  private streams: { [id: string]: Duplex } = {};

  private serverConfig: WebpackOptions;
  private clientConfig: WebpackOptions;

  constructor(pageConfig: Required<PageConfig>) {
    // console.log('vue2-packer:', pageConfig);
    const { pageDir = '', route = '', template = ''} = pageConfig;

    this.route = route;
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

    this.serverConfig.plugins.push(
      new HtmlWebpackPlugin({
        // templateContent: getServerTemplate(template || defalutTemplate, { isDev: true }),
      })
    )

    this.clientConfig = getClientConfig(clone(base), {
      mode: 'development',
      entry: join(pageDir, './App.vue'),
      dist: clientDist,
      hmrPath: this.hmrPath,
      onProgress: (percentage: number, message: string) => {
        if (percentage === 1) {
          // todo
        }
      },
    });

    this.initDevServer();
  }

  private get progress(): string {
    return `${this.route}/progress`;
  }

  private get hmrPath(): string {
    return `${this.route}/__webpack_hmr`;
  }

  private async initDevServer(): Promise<void> {
    await this.runDevServer();
    this.initServerCompiler();
    this.initClientCompiler();
    this.devServer.use(async (ctx, next) => {
      if (ctx.path === this.progress) {
        const duplexStream = new Duplex();
        const id = `stream-${Date.now()}`;
        this.streams[id] = duplexStream;
        ctx.body = duplexStream;
      } else {
        await next();
      }
    });
    this.devServer.use(serve(join(this.innerDist, './client')));
  }

  private runDevServer(): Promise<void> {
    return new Promise((resolve) => {
      const app = new Koa();

      app.listen(this.devPort, () => {
        this.devServer = app;
        resolve();
      });
    })
  }

  private initServerCompiler() {
    webpack(this.serverConfig as Configuration).watch({}, (err, stats) => {
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
    const clientCompiler = webpack(this.clientConfig as Configuration);

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
    return {
      renderToString: (ctx, callback) => callback(null, ejs.render(buildingEjs, { url: this.progress }))
    } as BundleRenderer;
  }

  private removeStream(id: string) {
    this.streams[id] = null;
  }
}
