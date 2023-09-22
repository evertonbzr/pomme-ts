import express from 'express';
import { p } from './index';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';
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

const todoController = p
  .controller()
  .withPath('/todo')
  .withFields([v1ListTodos])
  .build();

const server = p
  .server()
  .withApp(app)
  .withPlugins([
    generateRoutesOutputPlugin({
      homeWithLastChecksum: true,
      limit: 5,
    }),
  ])
  .withControllers([todoController])
  .build();

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
