import p from './functions';
import express from 'express';

const app = express();

const main = p.$main(app);

async function bootstrap() {
  const app = await main.create({
    modules: [],
  });

  app.listen(3000);
}

bootstrap();
