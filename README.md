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
import {
  MakeController,
  MakeServer,
  generateRoutesOutput,
  makeField,
} from 'pomme-ts';

import express from 'express';

const app = express();
app.use(express.json());

const listTodos = makeField.get({
  key: 'listTodos',
  async resolve({ body }, ctx) {
    return [
      {
        title: 'Todo',
      },
    ];
  },
});

const todoController = MakeController.create()
  .withPath('/todo')
  .withFields([listTodos])
  .build();

const controllers = [todoController];

const server = MakeServer.create()
  .withApp(app)
  .withPrefix('/v1')
  .withControllers(controllers)
  .build();

//Optional
generateRoutesOutput(server);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
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
