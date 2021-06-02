import { PageConfig } from './mieTypes';

export interface RenderOpts {
  /**
   * 是否为开发模式，默认 false
   */
  dev: boolean;

  /**
   * 页面配置
   */
  pageConfig: Required<PageConfig>;
}

export interface RenderInstance {
  /**
   * 渲染器配置
   */
  options: RenderOpts;

  render(context): Promise<string>;
}

export interface RenderStatic {
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
  new(options: RenderOpts): RenderInstance;
}
