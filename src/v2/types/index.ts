import { Router } from 'express';

export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteMetadata {
  method: HTTP_METHODS;
  path: string;
  router: Router;
}

export interface ControllerMetadata {
  pathName: string;
  routes: RouteMetadata[];
  router: Router;
}

export interface ModuleMetadata {
  controllers: ControllerMetadata[];
  router: Router;
}

export interface MainMetadata {
  modules: ModuleMetadata[];
}
