import { z } from 'zod';
import { p } from './index';

import express from 'express';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';

const app = express();

app.use(express.json());

const v1GetTodo = p.field.get({
  key: 'getTodo',
  async resolver(input, ctx) {
    return {
      id: 1,
      name: 'todo',
    };
  },
});

const todoController = p
  .controller()
  .withPath('/todo')
  .withFields([v1GetTodo])
  .build();

p.server()
  .withApp(app)
  .withPlugins([generateRoutesOutputPlugin])
  .withControllers([todoController])
  .build();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
