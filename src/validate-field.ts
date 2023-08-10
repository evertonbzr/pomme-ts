import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validateField =
  (schema: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema) {
        if (schema.body) {
          schema.body.parse(req.body);
        }
        if (schema.query) {
          schema.query.parse(req.query);
        }
        if (schema.params) {
          schema.params.parse(req.params);
        }
      }
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
