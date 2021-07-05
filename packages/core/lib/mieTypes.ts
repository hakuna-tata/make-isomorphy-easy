import { RendererStatic } from './rendererTypes';

/**
 * 页面集合
 */
export interface PageConfig {
  /**
   * 页面所在目录
   */
  pageDir: string;

   /**
   * 页面需要的渲染器
   */
  Renderer: RendererStatic;

  /**
   * 页面路由
   */
  route?: string;

  /**
   * 自定义渲染模版
   */
  template?: string;

  /**
   * 自定义构建配置
   */
  packerOption?: {
    client?: Record<string, unknown>;

    server?: Record<string, unknown>;
  }
}

export interface MieOpts {
  collections: Array<PageConfig>;

  /**
   * 是否为开发模式，默认 false
   */
  dev?: boolean;

  /**
   * 构建产物目录
   */
  dist?: string

  /**
   * 构建产物的 publicPath，默认: /dist/
   */
  publicPath?: string;

  /**
   * 错误回调函数
   */
  onError?: (Error: Error, BaseContext) => void;
}
