import { base } from '../../conf/webpack.base';
import { getClientConfig } from '../../conf/webpack.client';
import { getServerConfig } from '../../conf/webpack.server';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';

export class Packer {
  private baseConfig: WebpackOptions = JSON.parse(JSON.stringify(base));
  
  constructor() {}
}
