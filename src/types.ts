import { Express, Request, RequestHandler, Router } from 'express';
import { AnyZodObject } from 'zod';

export type Field = {
  key: string;
  router: Router;
  noMw?: boolean;
  path: string;
  reqType: ReqMethod;
  bodyZod?: AnyZodObject;
  queryZod?: AnyZodObject;
  paramsZod?: AnyZodObject;
};

export type FieldInputOptional = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export type ReqMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ResolveInput = {
  body?: any;
  query?: any;
  params?: any;
};

export interface FieldArgs<K = any> {
  key: string;
  reqType: ReqMethod;
  params?: string[];
  bodyZod?: AnyZodObject;
  queryZod?: AnyZodObject;
  paramsZod?: AnyZodObject;
  noMw?: boolean;
  resolve: (input: ResolveInput, ctx: Request) => Promise<K>;
  options?: {
    middlewares?: RequestHandler[];
  };
}

export type OmitFieldArgs = Omit<FieldArgs, 'reqType'>;

export type Controller = {
  route: Router;
  paths: {
    key: string;
    route: string;
    req: string;
    bodySchema?: string;
    querySchema?: string;
  }[];
  fields: Field[];
};

export type MakeServerArgs = {
  app: Express;
  controllers: Controller[];
  prefix?: string;
};

export type MakeControllerOpts = {
  middleware?: RequestHandler[];
};

export type RouterBuildType = {
  path?: string;
  method?: ReqMethod;
  middlewares?: RequestHandler[];
  controller?: any;
  router: Router;

  setPath(path: string): RouterBuildType;
  setMethod(method: ReqMethod): RouterBuildType;
  setController(controller: any): RouterBuildType;
  setMiddlewares(middlewares: RequestHandler[]): RouterBuildType;
  build(): Router;
};
