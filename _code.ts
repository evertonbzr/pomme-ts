import express from 'express';
import { p } from './index';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';
const app = express();

app.use(express.json());

const v1ListTodos = p.field.get({
  key: 'v1ListTodos',
  async resolver(input, ctx) {
    return [
      {
        id: '1',
        title: 'Todo 1',
      },
    ];
  },
});

const v1GetTodo = p.field.get({
  key: 'v1GetTodo',
  path: '/:id',
  options: {
    middlewares: [],
  },
  noMw: true,
  async resolver(input, ctx) {
    const { id } = input.params;

    return [
      {
        id,
        title: 'Todo 1',
      },
    ];
  },
});

const todoController = p
  .controller()
  .withPath('/todo')
  .withMiddlewares([])
  .withFields([v1ListTodos, v1GetTodo])
  .build();

const controllers = [todoController];

p.server()
  .withApp(app)
  .withPlugins([
    generateRoutesOutputPlugin({
      homeWithLastChecksum: true,
    }),
  ])
  .withPrefix('/v1')
  .withControllers(controllers)
  .build();

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
