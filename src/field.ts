import { Request, Response, Router } from "express";
import { AnyZodObject } from "zod";
import { RouterBuild } from "./router-build";
import { Field, FieldArgs, OmitFieldArgs, ParseZod, ReqMethod } from "./types";
import { validateRequest } from "./validate-field";

function _makeField<
	Body extends AnyZodObject = AnyZodObject,
	Path extends string = string,
	Query extends AnyZodObject = AnyZodObject,
>({
	reqType,
	path,
	resolver,
	bodySchema,
	querySchema,
	key,
	noImportMiddleware = false,
	middlewares = [],
}: FieldArgs<Body, Path, Query>): Field {
	const routerBuild = new RouterBuild();

	let pathDefine = path ?? "/";

	pathDefine = pathDefine.startsWith("/") ? pathDefine : `/${pathDefine}`;

	const router = routerBuild
    .setPath(pathDefine)
    .setMethod(reqType)
    .setMiddlewares([
      ...middlewares,
      validateRequest({
        ...(bodySchema && { body: bodySchema }),
        ...(querySchema && { query: querySchema }),
      }),
    ])
    .setController(
      async (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// biome-ignore lint/complexity/noBannedTypes: <explanation>
req: Request<any, {}, ParseZod<Body>, ParseZod<Query>>,
        res: Response,
      ) => {
        const { body, params, query } = req;

        const response = await resolver({ body, params, query }, req);

        res.json(response);
      },
    )
    .build();

	return {
		router,
		noImportMiddleware,
		path: pathDefine,
		reqType,
		key,
		bodySchema,
		querySchema,
	};
}

/**
 * Represents a route build.
 */
export const route = {
	withMethod: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		reqType: ReqMethod,
		options: OmitFieldArgs<Body, Path, Query>,
	) => _makeField<Body, Path, Query>({ ...options, reqType }),

	get: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		options: OmitFieldArgs<Body, Path, Query>,
	) => route.withMethod<Body, Path, Query>("GET", options),

	post: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		options: OmitFieldArgs<Body, Path, Query>,
	) => route.withMethod<Body, Path, Query>("POST", options),

	put: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		options: OmitFieldArgs<Body, Path, Query>,
	) => route.withMethod<Body, Path, Query>("PUT", options),

	delete: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		options: OmitFieldArgs<Body, Path, Query>,
	) => route.withMethod<Body, Path, Query>("DELETE", options),

	patch: <
		Body extends AnyZodObject = AnyZodObject,
		Path extends string = string,
		Query extends AnyZodObject = AnyZodObject,
	>(
		options: OmitFieldArgs<Body, Path, Query>,
	) => route.withMethod<Body, Path, Query>("PATCH", options),
};

route.get({
	key: "listTodos",
	async resolver(input, ctx) {
		return {};
	},
});
