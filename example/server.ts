import Koa from 'koa';
import catchError from './exception';
import MIE from '@mie-js/core'
import { config } from './config';

const app = new Koa();
const port = 3000;

app.use(catchError);
app.use(MIE(config));

app.listen(port);
