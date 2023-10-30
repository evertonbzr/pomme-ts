import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AnyZodObject, ZodError, ZodSchema, ZodTypeAny } from 'zod';

export const sendErrors: (
  errors: Array<ErrorListItem>,
  res: Response,
) => void = (errors, res) => {
  return res
    .status(400)
    .send(errors.map((error) => ({ type: error.type, errors: error.errors })));
};

export declare type RequestValidation<TParams, TQuery, TBody> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};
type ErrorListItem = {
  type: 'Query' | 'Params' | 'Body';
  errors: ZodError<any>;
};

export const validateRequest: <TParams = any, TQuery = any, TBody = any>(
  schemas: RequestValidation<TParams, TQuery, TBody>,
) => RequestHandler<TParams, any, TBody, TQuery> =
  ({ params, query, body }) =>
  (req, res, next) => {
    const errors: Array<ErrorListItem> = [];
    if (params) {
      const parsed: any = params.safeParse(req.params);

      if (!parsed.success) {
        errors.push({ type: 'Params', errors: parsed.error });
      }
    }
    if (query) {
      const parsed: any = query.safeParse(req.query);
      if (!parsed.success) {
        errors.push({ type: 'Query', errors: parsed.error });
      }
      req.query = parsed.data;
    }
    if (body) {
      const parsed: any = body.safeParse(req.body);
      if (!parsed.success) {
        errors.push({ type: 'Body', errors: parsed.error });
      }
    }
    if (errors.length > 0) {
      return sendErrors(errors, res);
    }
    return next();
  };
