import { RequestHandler, Router } from "express";
import { ReqMethod } from "./types";

export class RouterBuild {
	private path: string | undefined;
	private method: ReqMethod | undefined;
	private middlewares: RequestHandler[];
	private controller: RequestHandler;
	private router: Router;

	constructor() {
		this.path = undefined;
		this.method = undefined;
		this.middlewares = [];
		this.controller = undefined;
		this.router = Router();
	}

	setPath(path: string): RouterBuild {
		this.path = path;
		return this;
	}

	setMethod(method: ReqMethod): RouterBuild {
		this.method = method;
		return this;
	}

	setController(controller: RequestHandler): RouterBuild {
		this.controller = controller;
		return this;
	}

	setMiddlewares(middlewares: RequestHandler[]): RouterBuild {
		this.middlewares = middlewares;
		return this;
	}

	build(): Router {
		if (!this.method || !this.path || !this.controller) {
			throw new Error(
				"RouterBuild requires path, method, and controller to be set.",
			);
		}

		this.router
			.route(this.path)
			[this.method.toLowerCase()](...this.middlewares, this.controller);

		return this.router;
	}
}
