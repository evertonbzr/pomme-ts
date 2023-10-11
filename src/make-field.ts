import { Field, FieldArgs, OmitFieldArgs, ParseZod, ReqMethod } from './types';
import { Request, Response } from 'express';
import { validateField } from './validate-field';
import { RouterBuild } from './router-build';
import { ZodTypeAny } from 'zod';

function _makeField<
  Body extends ZodTypeAny = ZodTypeAny,
  Path extends string = string,
  Query extends ZodTypeAny = ZodTypeAny,
>({
  reqType,
  path,
  resolver,
  bodySchema,
  querySchema,
  key,
  noMw = false,
  options = {
    middlewares: [],
  },
}: FieldArgs<Body, Path, Query>): Field {
  const routerBuild = new RouterBuild();

  const { middlewares } = options;

  let pathDefine = path ?? '/';

  const router = routerBuild
    .setPath(pathDefine)
    .setMethod(reqType)
    .setMiddlewares([
      ...middlewares,
      validateField({
        body: bodySchema ?? null,
        query: null,
      }),
    ])
    .setController(
      async (
        req: Request<any, {}, ParseZod<Body>, ParseZod<Query>>,
        res: Response,
      ) => {
        const { body, params, query } = req;

        const response = await resolver({ body, params, query }, req);

        res.json({
          data: response,
        });
      },
    )
    .build();

  return {
    router,
    noMw,
    path: pathDefine,
    reqType,
    key,
    bodySchema,
    querySchema,
  };
}

export const route = {
  withMethod: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    reqType: ReqMethod,
    options: OmitFieldArgs<Body, Path, Query>,
  ) => _makeField<Body, Path, Query>({ ...options, reqType }),

  get: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Path, Query>,
  ) => route.withMethod<Body, Path, Query>('GET', options),

  post: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Path, Query>,
  ) => route.withMethod<Body, Path, Query>('POST', options),

  put: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Path, Query>,
  ) => route.withMethod<Body, Path, Query>('PUT', options),

  delete: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Path, Query>,
  ) => route.withMethod<Body, Path, Query>('DELETE', options),

  patch: <
    Body extends ZodTypeAny = ZodTypeAny,
    Path extends string = string,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Path, Query>,
  ) => route.withMethod<Body, Path, Query>('PATCH', options),
};
