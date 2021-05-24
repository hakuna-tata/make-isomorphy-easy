import Koa from 'koa';
import MIE from '@mie-js/core'
import { config } from './config';

const app = new Koa();
const port = 3000;

app.use(MIE(config));

app.listen(port);
