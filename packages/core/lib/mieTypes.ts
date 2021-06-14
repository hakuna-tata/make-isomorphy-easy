import { RendererStatic } from './rendererTypes';

export interface PageConfig {
  /**
   * 页面所在目录
   */
  pageDir: string;

  /**
   * 页面路由
   */
  route: string;

   /**
   * 页面需要的渲染器
   */
  Renderer: RendererStatic;

  /**
   * 构建产物目录 (优先级高)
   */
  dist?: string

  /**
   * 渲染模板 (优先级高)
   */
  template?: string
}

export interface MieOpts {
  pages: Array<PageConfig>;

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
   * 渲染模板
   */
  template?: string
}
