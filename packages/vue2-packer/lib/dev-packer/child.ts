import Koa from 'koa';

process.on('message', (data) => {
  const { devPort } = data;
  const app = new Koa();

  app.listen(devPort, () => {
    process.send({
      app,
    })
  });
});
