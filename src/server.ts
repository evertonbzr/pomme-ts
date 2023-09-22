import { Express, RequestHandler } from 'express';
import { bold, cyan, green } from 'kleur/colors';
import { Controller, Plugin, ServerBuildType } from './types';
import { error, info } from './logger';

class _MakeServer {
  private prefix: string;
  private app: Express;
  private controllers: Controller[];
  private middlewares: RequestHandler[];
  private plugins: Plugin[];

  constructor() {
    this.prefix = '/';
    this.app = undefined;
    this.controllers = [];
    this.middlewares = [];
    this.plugins = [];
  }

  withPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  withPlugins(plugins: Plugin[]) {
    this.plugins = plugins;
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

  build(): ServerBuildType {
    if (!this.app) {
      error('RouterBuild requires app.');
      throw new Error('RouterBuild requires app.');
    }

    const routes = this.controllers.map((controller) => controller.route);
    const paths = this.controllers
      .map((controller) => {
        console.log(controller.key);
        return controller.paths.map((path) => ({
          ...path,
          route: `${controller.key}${path.route}`,
        }));
      })
      .flat();

    const prefix = this.prefix === '/' ? '' : this.prefix;

    for (const path of paths) {
      info(`${bold(path.key)} ${green(path.req)} ${prefix}${path.route}`);
    }

    for (const route of routes) {
      this.app.use(this.prefix, ...this.middlewares, route);
    }

    const formatedPaths = paths.map(
      (path) => `${path.req}${prefix}${path.route}`,
    );

    const pathsDuplicate = formatedPaths.filter(
      (key, index) => formatedPaths.indexOf(key) !== index,
    );

    if (pathsDuplicate.length) {
      throw new Error(`Duplicate routes found: ${pathsDuplicate.join(', ')}`);
    }

    const server = {
      app: this.app,
      controllers: this.controllers,
      paths,
      prefix,
    };

    for (const plugin of this.plugins) {
      plugin(server);
    }

    return server;
  }

  static create() {
    return new _MakeServer();
  }
}

export const server = _MakeServer.create;
