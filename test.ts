import { MakeController, MakeServer, makeField } from '.';
import express from 'express';

const app = express();

const getTodos = makeField.get({
  key: 'getTodos',
  async resolve(input, ctx) {
    return [];
  },
});

const todoController = MakeController()
  .setPath('/todo')
  .setFields([getTodos])
  .build();

MakeServer()
  .setApp(app)
  .setPrefix('/v1')
  .setControllers([todoController])
  .build();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
