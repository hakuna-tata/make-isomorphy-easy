import { statSync, readdirSync } from 'fs';
import { join } from 'path';
import { PageConfig, MieOpts } from './mieTypes';

// 保留目录名
const preserveDirs = ['components', 'assets', 'layout', 'utils', 'static', 'services'];

export const getPageConfig = (opts: MieOpts): Required<PageConfig>[] => {
  const pageConfigList: Required<PageConfig>[] = [];
  const { pages = [] } = opts;

  pages.forEach(pageConfig => {
    const { pageDir, Renderer, route = '', dist = '', template = '' } = pageConfig;

    const connector = route.match(/\/$/) ? '' : '/';

    const stats = statSync(pageDir);
    if (stats.isDirectory()) {
      readdirSync(pageDir, { withFileTypes: true })
        .filter(sub => {
          return sub.isDirectory() && preserveDirs.indexOf(sub.name) < 0
        })
        .forEach(sub => {
          const pageRoute = `${(route[0] === '/' ? route : `/${route}`)}${connector}${sub.name}`;
          pageConfigList.push({
            pageDir: join(pageDir, sub.name),
            Renderer,
            route: pageRoute,
            dist: dist || opts.dist,
            template: template || opts.template,
          })
        })
    }
  })

  return pageConfigList;
}

export const matchPage = (pageConfigList: Required<PageConfig>[], currentRoute: string)
  : Required<PageConfig> | void => {
     /**
     * 兼容当前路由为 / 情况，默认匹配到 /index
     */
    if(currentRoute === '/') {
      currentRoute = `${currentRoute}index`;
    }

    const targetPage = pageConfigList.find(pageConfig => {
      return new RegExp(`^${pageConfig.route}\\b\\/?`).exec(currentRoute);
    })

    return targetPage;
}
