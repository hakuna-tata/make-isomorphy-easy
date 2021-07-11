import { join } from 'path';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { PassThrough } from 'stream';
import { createProxyServer } from 'http-proxy';
import { PageConfig } from '@mie-js/core';
import { BundleRenderer } from 'vue-server-renderer';
import clone from 'clone-deep';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Koa from 'koa';
import serve from 'koa-static';
import webpack, { Configuration } from 'webpack';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import { getUsablePort } from './usablePort';
import { base } from '../conf/webpack.base';
import { getServerConfig } from '../conf/webpack.server';
import { getClientConfig } from '../conf/webpack.client';
import { getServerTemplate } from './template';

const MIN_PORT = 50000;
const MAX_PORT = 50999;
const MIE_SSE_URL = '<!--mie_sse_url-->';
const buildingHtml = readFileSync(join(__dirname, '../../template/building.html'), 'utf-8');
const defalutTemplate = readFileSync(join(__dirname, '../../template/default.html'), 'utf-8');

export class Packer extends EventEmitter {
  private devServer: Koa;
  private proxyServer;
  private route = '';
  private dist = '';
  private streams: { [id: string]: PassThrough } = {};
  private isCompiling = false;
  private buildStatus = { client: false, server: false };

  private serverConfig: WebpackOptions;
  private clientConfig: WebpackOptions;

  constructor(dist: string, pageConfig: Required<PageConfig>) {
    super();
    // console.log('vue2-packer:', pageConfig);
    const { pageDir, route, template, packerOption} = pageConfig;
    this.route = route;
    this.dist = dist;

    const serverDist = join(dist, `./server${route}`);
    const clientDist = join(dist, `./client${route}`);

    if (!existsSync(serverDist)) {
      mkdirSync(serverDist, { recursive: true });
    }
    if (!existsSync(clientDist)) {
      mkdirSync(clientDist, { recursive: true });
    }

    this.serverConfig = getServerConfig(clone(base), {
      mode: 'development',
      entry: {
        entry: join(__dirname, '../entry/server.js'),
        app: join(pageDir, './App.vue'),
      },
      dist: serverDist,
      publicPath: this.route,
      onProgress: (percentage: number) => {
        if (percentage === 1) {
          this.buildDone('server');
        }
      },
    });

    this.serverConfig.plugins.push(
      new HtmlWebpackPlugin({
        templateContent: getServerTemplate(template || defalutTemplate, { isDev: true }),
        inject: false,
        filename: join(serverDist, './template.html'),
      })
    )

    this.clientConfig = getClientConfig(clone(base), {
      mode: 'development',
      entry: {
        entry: join(__dirname, '../entry/client.js'),
        app: join(pageDir, './App.vue'),
      },
      dist: clientDist,
      publicPath: this.route,
      hmrPath: this.hmrPath,
      onProgress: (percentage: number) => {
        if (percentage === 1) {
          this.buildDone('client');
        } else {
          this.serverSentEvt({ percentage });
        }
      },
    });
  }

  private get progress(): string {
    return `${this.route}/progress`;
  }

  private get hmrPath(): string {
    return `${this.route}/__webpack_hmr`;
  }

  proxy(context): void {
    this.proxyServer.web(context.req, context.res);
  }

  async getBuildingRenderer(): Promise<BundleRenderer> {
    await this.initDevServer();

    return {
      renderToString: (ctx, callback) => {
        if (!this.isCompiling) {
          this.startCompile();
        }
        callback(null, buildingHtml.replace(MIE_SSE_URL, this.progress));
      }
    } as BundleRenderer;
  }

  private async initDevServer(): Promise<void> {
    return new Promise(async (resolve) => {
      const devPort = await getUsablePort(MIN_PORT, MAX_PORT);

      const app = new Koa();

      app.listen(devPort, () => {
        this.devServer = app;
        this.proxyServer = createProxyServer({
          target: `http://127.0.0.1:${devPort}`
        });

        resolve();
      });
    });
  }

  private startCompile() {
    this.isCompiling = true;
    this.initServerCompiler();
    this.initClientCompiler();

    this.devServer.use(async (ctx, next) => {
      if (ctx.path === this.progress) {
          const stream = new PassThrough();
          const id = `stream-${Date.now()}`;
          this.streams[id] = stream;

          ctx.req.on('close', () => this.removeStream(id));
          ctx.req.on('finish', () => this.removeStream(id));
          ctx.req.on('error', () => this.removeStream(id));
          
          ctx.type = 'text/event-stream';
          ctx.body = stream;
      } else {
        await next();
      }
    });

    this.devServer.use(serve(join(this.dist, './client')));
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

  private serverSentEvt(data: { percentage: number, msg?: string }) {
    const sseData = `data: ${JSON.stringify(data)}\n\n`;

    Object.keys(this.streams).forEach(streamId => this.streams[streamId]?.write(sseData));
  }

  private removeStream(id) {
    this.streams[id] = null;
  }

  private removeAllStreams() {
    Object.keys(this.streams).forEach((streamId) => {
      if (this.streams[streamId]) {
        this.streams[streamId].end();
        this.removeStream(streamId);
      }
    });
  }

  private buildDone(type: 'client' | 'server'): void {
    this.buildStatus[type] = true;

    if (this.buildStatus.server && this.buildStatus.client) {
      this.buildStatus.server = false;
      this.buildStatus.client = false;

      this.emit('buildEnd');
      this.serverSentEvt({ percentage: 1, msg: 'done' });
      this.removeAllStreams();
    }
  }
}
