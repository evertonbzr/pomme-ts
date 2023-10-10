# PommeTS - Router Builder for APIs with Express.js

PommeTS is a JavaScript library that provides a simple and efficient way to create routes for APIs in Express.js applications.

## Installation

To start using PommeTS in your project, you can install it using npm or yarn:

```bash
npm install pomme-ts
# or
yarn add pomme-ts
```

## How to Use

Here's a basic example of how to create a route using PommeTS:

```javascript
import express from 'express';
import { p } from 'pomme-ts';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';

import { z } from 'zod';
const app = express();
app.use(express.json());

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
  .withRoutes([v1GetTodo, v1CreateTodo])
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
```

## Features

PommeTS offers the following features:

- Creation of simple and expressive routes for APIs based on HTTP operations (GET, POST, PUT, DELETE, etc.).
- Support for handling route parameters, query strings, and middlewares.
- Organized structure to facilitate code maintenance and expansion.
- Possibility to group routes by controllers.

## Contributing

If you'd like to contribute to the project, feel free to open a pull request. Please feel free to report issues or request new features through Issues.

## License

PommeTS is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

We hope that PommeTS makes building APIs in your Express.js applications easier. If you have any questions or need assistance, don't hesitate to get in touch with us. We appreciate your interest in using PommeTS!
