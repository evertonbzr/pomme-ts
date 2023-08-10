import { z } from 'zod';
import {
  MakeController,
  MakeServer,
  generateRoutesOutput,
  makeField,
} from './index';
import express from 'express';

const app = express();

const listTodos = makeField.get({
  key: 'listTodos',
  bodySchema: z.object({
    zod: z.string(),
  }),
  async resolver(input, ctx) {},
});

const todoController = MakeController.create()
  .withPath('/todo')
  .withFields([listTodos])
  .build();

const controllers = [todoController];

const serverOne = MakeServer.create()
  .withApp(app)
  .withPrefix('/v1')
  .withControllers(controllers)
  .build();

generateRoutesOutput(serverOne);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
