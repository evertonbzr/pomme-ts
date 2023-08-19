import { z } from 'zod';
import {
  MakeController,
  MakeServer,
  generateRoutesOutput,
  makeField,
} from './index';

import express from 'express';

const app = express();
app.use(express.json());


// /todo/:id
const v1GetTodo = makeField.get({
  key: 'getTodo',
  path: '/:id',
  async resolver(input, ctx) {
    return {
      ok: true
    }
  },
})


const v1CreateTodo = makeField.post({
  key: 'createTodo',
  bodySchema: z.object({
    title: z.string(),
    description: z.string(),
    done: z.boolean().default(false),
  }),
  async resolver(input, ctx) {
    const { title, description, done } = input.body;
    return {
      id: 1,
      title,
      description,
      done,
    }
  },
})

const todoController = MakeController.create()
  .withPath('/todo')
  .withFields([v1GetTodo, v1CreateTodo])
  .build();

const server = MakeServer.create()
  .withApp(app)
  .withPrefix('/v1')
  .withControllers([todoController])
  .build();

generateRoutesOutput(server, {
  homeWithLastChecksum: false,
  limit: 5
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
