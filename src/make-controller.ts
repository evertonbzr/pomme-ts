import { RequestHandler, Router } from 'express';
import { Field } from './types';
import zodToJsonSchema from 'zod-to-json-schema';

class _MakeController {
  private path: string;
  private fields: Field[];
  private middleware: RequestHandler[];
  private router: Router;

  constructor() {
    this.path = undefined;
    this.fields = [];
    this.middleware = [];
    this.router = Router();
  }

  withPath(path: string) {
    this.path = path;
    return this;
  }

  withFields(fields: Field[]) {
    this.fields = fields;
    return this;
  }

  withMiddlewares(middleware: RequestHandler[]) {
    this.middleware = middleware;
    return this;
  }

  build() {
    const fieldsSorted = this.fields.sort((a) => {
      if (a.noMw) {
        return -1;
      } else {
        return 0;
      }
    });

    const fieldsPaths = fieldsSorted.map((field) => {
      const bodySchemaJSON = field.bodySchema
        ? zodToJsonSchema(field.bodySchema)
        : null;
      const querySchemaJSON = field.querySchema
        ? zodToJsonSchema(field.querySchema)
        : null;

      return {
        key: field.key,
        route: this.path + field.path,
        req: field.reqType,
        ...(bodySchemaJSON && {
          bodySchema: JSON.stringify(bodySchemaJSON),
        }),
        ...(querySchemaJSON && {
          querySchema: JSON.stringify(querySchemaJSON),
        }),
      };
    });

    fieldsSorted.forEach((field) => {
      if (!field.noMw) {
        this.router.use(this.path, ...this.middleware, field.router);
      } else {
        this.router.use(this.path, field.router);
      }
    });

    return {
      route: this.router,
      paths: fieldsPaths,
      fields: fieldsSorted,
    };
  }
}

export class MakeController {
  static create() {
    return new _MakeController();
  }
}
