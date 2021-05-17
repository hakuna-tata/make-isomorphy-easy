import Koa from 'koa';

const app = new Koa();
const port = 3000;

app.use(async ctx => {
  ctx.body = 'Hello MIE';
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`)
});
