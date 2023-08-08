import { Express, RequestHandler } from 'express';
import { Controller } from './types';
import { Generator } from './generator';

class _MakeServer {
  private prefix: string;
  private app: Express;
  private controllers: Controller[];
  private middlewares: RequestHandler[];
  private gen: boolean;

  constructor() {
    this.gen = false;
    this.prefix = '/';
    this.app = undefined;
    this.controllers = [];
    this.middlewares = [];
  }

  withPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  withApp(app: Express) {
    this.app = app;
    return this;
  }

  withControllers(controllers: Controller[]) {
    this.controllers = controllers;
    return this;
  }

  withMiddlewares(middlewares: RequestHandler[]) {
    this.middlewares = middlewares;
    return this;
  }

  activateGenerator() {
    this.gen = true;
    return this;
  }

  build() {
    const generator = new Generator();
    if (!this.app) {
      throw new Error('RouterBuild requires app.');
    }

    const routes = this.controllers.map((controller) => controller.route);
    const paths = this.controllers.map((controller) => controller.paths).flat();

    const duplicatesRoutes = paths.filter(
      (key, index) => paths.indexOf(key) !== index,
    );

    if (duplicatesRoutes.length) {
      throw new Error(
        `Duplicate controller keys found: ${duplicatesRoutes.join(', ')}`,
      );
    }

    const prefix = this.prefix === '/' ? '' : this.prefix;

    for (const path of paths) {
      console.log(
        `[MakeServer] ${path.key} ${path.req} ${prefix}${path.route}`,
      );
    }

    if (this.gen) {
      const formatedPaths = paths.map((path) => {
        const req = `<@req>${path.req}</@req>`;
        const route = `<@route>${prefix}${path.route}</@route>`;
        const key = `<@key>${path.key}</@key>`;
        const bodySchema = path.bodySchema
          ? `<@body>${path.bodySchema}</@body>`
          : '';
        const querySchema = path.querySchema
          ? `<@query>${path.querySchema}</@query>`
          : '';

        return `${key}${req}${route}${bodySchema}${querySchema}`;
      });
      generator.setPaths(formatedPaths).build();
    }

    for (const route of routes) {
      this.app.use(this.prefix, ...this.middlewares, route);
    }

    return this;
  }
}

export class MakeServer {
  static create() {
    return new _MakeServer();
  }
}
