import { z } from 'zod';
import {
  MakeController,
  MakeServer,
  generateRoutesOutput,
  makeField,
} from './index';

import express from 'express';

const app = express();

const v1ListTodos = makeField.get({
  key: 'v1ListTodos',
  async resolver(input, ctx) {
    return [
      {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
      },
    ];
  },
});

const v1CreateTodo = makeField.post({
  key: 'v1CreateTodo',
  bodySchema: z.object({
    title: z.string(),
    description: z.string(),
  }),
  async resolver(input, ctx) {
    const { title, description } = input.body;
    return {
      id: '1',
      title,
      description,
    };
  },
});

const v1GetTodo = makeField.get({
  key: 'v1GetTodo',
  path: '/:id/home/:infoId',
  async resolver(input, ctx) {
    const { id, infoId } = input.params;
    return {
      id: '1',
      title: 'Todo 1',
      description: 'Description 1',
    };
  },
});

const todoController = MakeController.create()
  .withPath('/todo')
  .withFields([v1ListTodos, v1GetTodo, v1CreateTodo])
  .build();

const controllers = [todoController];

const serverOne = MakeServer.create()
  .withApp(app)
  .withPrefix('/v1')
  .withControllers(controllers)
  .build();

generateRoutesOutput(serverOne, { limit: 5, homeWithLastChecksum: true });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
