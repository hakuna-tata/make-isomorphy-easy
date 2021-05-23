import Koa from 'koa';
import MIE from '@mie-js/core'

const app = new Koa();
const port = 3000;

app.use(async ctx => {
  ctx.body = MIE(2, 3);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`)
});
