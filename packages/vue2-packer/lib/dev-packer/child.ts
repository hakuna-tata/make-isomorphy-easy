import Koa from 'koa';

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(9000, () => {
  process.send({
    app,
    port: '9000'
  });
});