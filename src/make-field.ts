import { Field, FieldArgs, OmitFieldArgs, ParseZod, ReqMethod } from './types';
import { Request, Response } from 'express';
import { validateField } from './validate-field';
import { RouterBuild } from './router-build';
import { ZodTypeAny } from 'zod';

function _makeField<
  Body extends ZodTypeAny = ZodTypeAny,
  Params extends ReadonlyArray<string> = ReadonlyArray<string>,
  Query extends ZodTypeAny = ZodTypeAny,
>({
  reqType,
  params,
  resolver,
  bodySchema,
  querySchema,
  key,
  noMw = false,
  options = {
    middlewares: [],
  },
}: FieldArgs<Body, Params, Query>): Field {
  const routerBuild = new RouterBuild();

  const { middlewares } = options;

  let path = '/';

  if (params && params.length > 0) {
    for (const param of params) {
      path += `${param.replace(/^\/|\/$/i, '')}/`;
    }
  }

  const router = routerBuild
    .setPath(path)
    .setMethod(reqType)
    .setMiddlewares([
      ...middlewares,
      validateField({
        body: bodySchema ?? null,
        query: querySchema ?? null,
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
    path,
    reqType,
    key,
    bodySchema,
    querySchema,
  };
}

export const makeField = {
  withMethod: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    reqType: ReqMethod,
    options: OmitFieldArgs<Body, Params, Query>,
  ) => _makeField<Body, Params, Query>({ ...options, reqType }),

  get: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Params, Query>,
  ) => makeField.withMethod<Body, Params, Query>('GET', options),

  post: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Params, Query>,
  ) => makeField.withMethod<Body, Params, Query>('POST', options),

  put: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Params, Query>,
  ) => makeField.withMethod<Body, Params, Query>('PUT', options),

  delete: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Params, Query>,
  ) => makeField.withMethod<Body, Params, Query>('DELETE', options),

  patch: <
    Body extends ZodTypeAny = ZodTypeAny,
    Params extends ReadonlyArray<string> = ReadonlyArray<string>,
    Query extends ZodTypeAny = ZodTypeAny,
  >(
    options: OmitFieldArgs<Body, Params, Query>,
  ) => makeField.withMethod<Body, Params, Query>('PATCH', options),
};
