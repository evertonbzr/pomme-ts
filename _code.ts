import express from 'express';
import { p } from './index';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';
import { generateSwaggerOutput } from './plugins/generateSwaggerOutput';

import { z } from 'zod';
const app = express();
app.use(express.json());

const v1ListTodos = p.route.get({
  key: 'v1ListTodos',
  bodySchema: z.object({
    title: z.string(),
  }),
  async resolver(input, ctx) {
    const { title } = input.body;
    return [
      {
        id: '1',
        title: 'Todo 1',
      },
    ];
  },
});

const v1CreateTodo = p.route.post({
  key: 'v1CreateTodo',
  bodySchema: z.object({
    title: z.string(),
  }),
  async resolver(input, ctx) {
    const { title } = input.body;
    return [
      {
        id: '1',
        title: 'Todo 1',
      },
    ];
  },
});

const v1UpdateTodo = p.route.put({
  key: 'v1UpdateTodo',
  async resolver({}, _) {
    return null;
  },
});

const v1GetTodo = p.route.get({
  key: 'v1GetTodo',
  path: '/:id',
  querySchema: z.object({
    title: z.string().optional(),
  }),
  async resolver(input, ctx) {
    const { title } = input.body;
    return [
      {
        id: '1',
        title: 'Todo 1',
      },
    ];
  },
});

const todoController = p
  .controller()
  .withPath('/todo')
  .withRoutes([v1ListTodos, v1GetTodo, v1CreateTodo, v1UpdateTodo])
  .build();

const server = p
  .server()
  .withApp(app)
  .withPlugins([
    generateRoutesOutputPlugin({
      homeWithLastChecksum: true,
      limit: 1,
    }),
    generateSwaggerOutput({
      openapi: '3.0.0',
      info: {
        title: 'Sample API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    }),
  ])
  .withControllers([todoController])
  .build();

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
