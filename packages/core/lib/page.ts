import { statSync } from 'fs';
import { sep } from 'path';
import { PageConfig, MieOpts } from './optTypes';

// 保留目录名
const preserveDirs = ['components', 'assets', 'layout', 'utils', 'static', 'services'];

export const scanPages = (opts: MieOpts): Required<PageConfig>[] => {
  const page: Required<PageConfig>[] = [];
  const { pages = [] } = opts;

  pages.forEach(pageConfig => {
    const { pageDir, route = '', dist = '', template = ''} = pageConfig;

    const stats = statSync(pageDir);
  })

  return page;
}
