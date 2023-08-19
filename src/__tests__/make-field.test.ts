import { beforeEach, describe, expect, it } from 'vitest';
import { Request, Response } from 'express';
import { makeField } from '../make-field';

let mockRequest: Request;
let mockResponse: Response;
describe('make field', () => {
  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {} as Response;
  });

  it('should create a GET field', () => {
    const field = makeField.get({
      key: 'field',
      path: '/:id',
      async resolver(input, ctx) {},
    });

    const routeDefinition = {
      path: '/:id',
      method: 'get',
    };

    const { key, reqType, router, bodySchema, noMw, querySchema } = field;

    expect({
      key,
      reqType,
      bodySchema,
      noMw,
      querySchema,
    }).toEqual({
      key: 'field',
      reqType: 'GET',
      bodySchema: undefined,
      noMw: false,
      querySchema: undefined,
    });

    expect(
      router.stack.some((s) =>
        Object.keys(s.route.methods).includes(routeDefinition.method),
      ),
    ).toBe(true);
    expect(
      router.stack.some((s) => s.route.path === routeDefinition.path),
    ).toBe(true);
  });

  it('should create a POST field', () => {
    const field = makeField.post({
      key: 'field',
      async resolver(input, ctx) {},
    });

    const routeDefinition = {
      path: '/',
      method: 'post',
    };

    const { key, reqType, router, bodySchema, noMw, querySchema } = field;

    expect({
      key,
      reqType,
      bodySchema,
      noMw,
      querySchema,
    }).toEqual({
      key: 'field',
      reqType: 'POST',
      bodySchema: undefined,
      noMw: false,
      querySchema: undefined,
    });

    expect(
      router.stack.some((s) =>
        Object.keys(s.route.methods).includes(routeDefinition.method),
      ),
    ).toBe(true);

    expect(
      router.stack.some((s) => s.route.path === routeDefinition.path),
    ).toBe(true);
  });

  it('should create a PUT field', () => {
    const field = makeField.put({
      key: 'field',
      path: '/:id',
      async resolver(input, ctx) {},
    });

    const routeDefinition = {
      path: '/:id',
      method: 'put',
    };

    const { key, reqType, router, bodySchema, noMw, querySchema } = field;

    expect({
      key,
      reqType,
      bodySchema,
      noMw,
      querySchema,
    }).toEqual({
      key: 'field',
      reqType: 'PUT',
      bodySchema: undefined,
      noMw: false,
      querySchema: undefined,
    });

    expect(
      router.stack.some((s) =>
        Object.keys(s.route.methods).includes(routeDefinition.method),
      ),
    ).toBe(true);

    expect(
      router.stack.some((s) => s.route.path === routeDefinition.path),
    ).toBe(true);
  });
});
