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
const express = require('express');
const { MakeServer, MakeController, makeField } = require('pomme-ts');

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
const todoController = MakeController()
    .setPath('/todo')
    .setFields([listTodos])
    .build();

const controllers = [todoController];

// Grouping controllers by configuring directly on the app
MakeServer().setApp(app).setControllers(controllers).build();
// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000.');
});
```

## Features

PommeTS offers the following features:

-   Creation of simple and expressive routes for APIs based on HTTP operations (GET, POST, PUT, DELETE, etc.).
-   Support for handling route parameters, query strings, and middlewares.
-   Organized structure to facilitate code maintenance and expansion.
-   Possibility to group routes by controllers.

## Contributing

If you'd like to contribute to the project, feel free to open a pull request. Please feel free to report issues or request new features through Issues.

## License

PommeTS is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

We hope that PommeTS makes building APIs in your Express.js applications easier. If you have any questions or need assistance, don't hesitate to get in touch with us. We appreciate your interest in using PommeTS!
