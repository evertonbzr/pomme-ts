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

  setPrefix(prefix: string): _MakeServer {
    this.prefix = prefix;
    return this;
  }

  activateGenerator(): _MakeServer {
    this.gen = true;
    return this;
  }

  setApp(app: Express): _MakeServer {
    this.app = app;
    return this;
  }

  setControllers(controllers: Controller[]): _MakeServer {
    this.controllers = controllers;
    return this;
  }

  setMiddlewares(middlewares: RequestHandler[]): _MakeServer {
    this.middlewares = middlewares;
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

export const MakeServer = () => new _MakeServer();
