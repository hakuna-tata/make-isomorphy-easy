import { statSync, readdirSync } from 'fs';
import { join } from 'path';
import { PageConfig, MieOpts } from './mieTypes';

// 保留目录名
const preserveDirs = ['components', 'assets', 'layout', 'utils', 'static', 'services'];

export const scanPages = (opts: MieOpts): Required<PageConfig>[] => {
  const page: Required<PageConfig>[] = [];
  const { pages = [] } = opts;

  pages.forEach(pageConfig => {
    const { pageDir, route = '', dist = '', template = '' } = pageConfig;

    const connector = route.match(/\/$/) ? '' : '/';

    const stats = statSync(pageDir);
    if (stats.isDirectory()) {
      readdirSync(pageDir, { withFileTypes: true })
        .filter(sub => {
          return sub.isDirectory() && preserveDirs.indexOf(sub.name) < 0
        })
        .forEach(sub => {
          const pageRoute = `${(route[0] === '/' ? route : `/${route}`)}${connector}${sub.name}`;
          page.push({
            pageDir: join(pageDir, sub.name),
            route: pageRoute,
            dist: dist || opts.dist,
            template: template || opts.template,
          })
        })
    }
  })

  return page;
}
