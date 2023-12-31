import { RequestHandler, Router } from 'express';
import { Field } from './types';
import zodToJsonSchema from 'zod-to-json-schema';

class Controller {
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

  withRoutes(fields: Field[]) {
    this.fields = fields;
    return this;
  }

  withMiddlewares(middleware: RequestHandler[]) {
    this.middleware = middleware;
    return this;
  }

  build() {
    if (!this.path) {
      throw new Error('ControllerBuild requires path.');
    }

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
        route: field.path,
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
      key: this.path,
      route: this.router,
      paths: fieldsPaths,
      fields: fieldsSorted,
    };
  }

  static create() {
    return new Controller();
  }
}

export const controller = Controller.create;
