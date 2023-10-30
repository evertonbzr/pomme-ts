import { Router } from 'express';
import { ModuleMetadata } from '../types';
import { Controller } from './controller';

export class Module {
  public controllers: Controller[] = [];
  protected router: Router;

  constructor() {
    this.router = Router();
  }
  public build(): ModuleMetadata {
    const controllers = this.controllers.map((controller) =>
      controller.build(),
    );

    return {
      controllers,
      router: this.router,
    };
  }
}

export const $module = new Module();
