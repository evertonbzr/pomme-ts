import { Express, Request, RequestHandler, Response, Router } from "express";
import { ZodTypeAny, z } from "zod";

export type ParseZod<ZodItem extends ZodTypeAny> = z.infer<ZodItem>;

export type Field = {
	key: string;
	router: Router;
	noImportMiddleware?: boolean;
	path: string;
	reqType: ReqMethod;
	bodySchema?: ZodTypeAny;
	querySchema?: ZodTypeAny;
};

type ParseRouteParams<Rte> = Rte extends `${string}:${infer P}/${infer Rest}`
	? P | ParseRouteParams<`/${Rest}`>
	: Rte extends `${string}:${infer P}`
	  ? P
	  : never;

export type ReqMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FieldArgs<
	BodySchema extends ZodTypeAny = ZodTypeAny,
	Path extends string = string,
	QuerySchema extends ZodTypeAny = ZodTypeAny,
> {
	key: string;
	reqType: ReqMethod;
	path?: Path;
	bodySchema?: BodySchema;
	querySchema?: QuerySchema;
	noImportMiddleware?: boolean;
	resolver: (
		input: {
			body: ParseZod<BodySchema>;
			params: Record<ParseRouteParams<Path>, string>;
			query: ParseZod<QuerySchema>;
		},
		ctx: Request,
	) => Promise<any>;
	middlewares?: RequestHandler[];
}

export type OmitFieldArgs<
	BodySchema extends ZodTypeAny = ZodTypeAny,
	Path extends string = string,
	QuerySchema extends ZodTypeAny = ZodTypeAny,
> = Omit<FieldArgs<BodySchema, Path, QuerySchema>, "reqType">;

export type Path = {
	key: string;
	route: string;
	req: string;
	controllerPath?: string;
	bodySchema?: string;
	querySchema?: string;
};

export type RouteDefinition = {
	path: string;
	method: ReqMethod;
	key: string;
	bodySchema?: string;
	querySchema?: string;
};

export type Controller = {
	key: string;
	route: Router;
	paths: Path[];
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

export type ServerBuildType = {
	app: Express;
	paths: Path[];
	prefix: string;
	controllers: Controller[];
};

export type Plugin = (server: ServerBuildType, ...args: any) => void;
