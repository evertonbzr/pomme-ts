# PommeTS - Router Builder para APIs com Express.js

O PommeTS é uma biblioteca JavaScript que fornece uma maneira simples e eficiente de criar rotas para APIs em aplicações Express.js.

## Instalação

Para começar a usar o PommeTS em seu projeto, você pode instalá-lo usando o npm ou yarn:

```bash
npm install pomme-ts
# ou
yarn add pomme-ts
```

## Como usar

Aqui está um exemplo básico de como criar uma rota usando o PommeTS:

```javascript
const express = require('express');
const { MakeServer, MakeController, makeField } = require('pomme-ts');

const app = express();

// implementação da rota
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

// agrupamento de rotas pelo controller
const todoController = MakeController()
    .setPath('/todo')
    .setFields([listTodos])
    .build();

const controllers = [todoController];

// agrupamento de controllers configurando direto no app
MakeServer().setApp(app).setControllers(controllers).build();
// Inicie o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000.');
});
```

## Recursos

O PommeTS oferece os seguintes recursos:

-   Criação de rotas simples e expressivas para APIs com base nas operações HTTP (GET, POST, PUT, DELETE, etc.).
-   Suporte para manipulação de parâmetros de rota, query strings e middlewares.
-   Estrutura organizada para facilitar a manutenção e expansão do código.
-   Possibilidade de agrupar rotas por controladores.

## Contribuindo

Se você quiser contribuir para o projeto, fique à vontade para abrir um pull request. Sinta-se à vontade para relatar problemas ou solicitar novos recursos por meio das Issues.

## Licença

O PommeTS é licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

---

Esperamos que o PommeTS facilite a construção de APIs em suas aplicações Express.js. Se tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato conosco. Agradecemos o seu interesse em usar o PommeTS!
