import { PageConfig } from './mieTypes';

export interface RendererOpts {
  /**
   * 是否为开发模式，默认 false
   */
  dev: boolean;

   /**
   * 构建目录
   */
  dist: string;

  /**
   * 页面配置
   */
  pageConfig: Required<PageConfig>;
}

export interface RendererInstance {
  /**
   * 渲染器配置
   */
  options: RendererOpts;

  render(context): Promise<string>;
}

export interface RendererStatic {
  /**
   * 渲染器类型
   */
  type: string;

  /**
   * 构建器
   */
  packer: string;

  /**
   * 构造函数
   */
  new(options: RendererOpts): RendererInstance;
}
