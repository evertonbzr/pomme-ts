import { MakeController, MakeServer, makeField } from './index';
import express from 'express';

const app = express();

// Route implementation
const listTodos = makeField.get({
  key: 'listTodos',
  async resolve(input, ctx) {
    return [
      {
        title: 'Todo',
      },
    ];
  },
});

// Route grouping by controller
const todoController = MakeController.create()
  .withPath('/todo')
  .withFields([listTodos])
  .build();

const controllers = [todoController];

// Grouping controllers by configuring directly on the app
MakeServer.create().withApp(app).withControllers(controllers).build();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
