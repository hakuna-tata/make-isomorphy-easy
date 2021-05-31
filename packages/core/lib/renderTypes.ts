export interface RenderOpts {
  /**
   * 是否为开发模式，默认 false
   */
  dev: string;

  /**
   * 页面路径
   */
  pageDir: string;

  /**
   * 构建产物目录
   */
  dist: string

  /**
   * 页面路由
   */
  route: string;

  /**
   * 渲染模板
   */
  template: string
}

export interface RenderInstance {
  /**
   * 渲染器配置
   */
  options: RenderOpts;

  render(context: never): Promise<string>;
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
