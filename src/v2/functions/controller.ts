import { Router } from 'express';
import { ControllerMetadata } from '../types';

export class Controller {
  public pathName: string;
  private router: Router;
  routes: any[];

  constructor() {
    this.router = Router();
  }

  setPath(path: string) {
    this.pathName = path;
    return this;
  }

  setRoutes(routes: any[]) {}

  public build(): ControllerMetadata {
    return {
      pathName: this.pathName,
      router: this.router,
      routes: [],
    };
  }
}

export const $controller = new Controller();
