import { Field, FieldArgs, OmitFieldArgs } from './types';
import { Request, Response } from 'express';
import { validateField } from './validate-field';
import { RouterBuild } from './router-build';

function _makeField({
  reqType,
  params,
  resolve,
  bodyZod,
  queryZod,
  paramsZod,
  key,
  noMw = false,
  options = {
    middlewares: [],
  },
}: FieldArgs): Field {
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
        body: bodyZod,
        query: queryZod,
        params: paramsZod,
      }),
    ])
    .setController(async (req: Request, res: Response) => {
      const { body, params, query } = req;
      const response = await resolve({ body, params, query }, req);

      res.json({
        data: response,
      });
    })
    .build();

  return {
    router,
    noMw,
    path,
    reqType,
    key,
    bodyZod,
    queryZod,
    paramsZod,
  };
}

export const makeField = {
  get: (options: OmitFieldArgs) => _makeField({ ...options, reqType: 'GET' }),
  post: (options: OmitFieldArgs) => _makeField({ ...options, reqType: 'POST' }),
  put: (options: OmitFieldArgs) => _makeField({ ...options, reqType: 'PUT' }),
  delete: (options: OmitFieldArgs) =>
    _makeField({ ...options, reqType: 'DELETE' }),
  patch: (options: OmitFieldArgs) =>
    _makeField({ ...options, reqType: 'PATCH' }),
  _: (options: FieldArgs) => _makeField(options),
};
