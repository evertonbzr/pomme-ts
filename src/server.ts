import { Express, RequestHandler } from "express";
import { bold, green } from "kleur/colors";
import { PommeError } from "./errors";
import { error, info } from "./logger";
import { getStorage } from "./store";
import { Controller, Plugin, ServerBuildType } from "./types";

class _MakeServer {
	private prefix: string;
	private app: Express;
	private _controllers: Controller[];
	private middlewares: RequestHandler[];
	private _plugins: Plugin[];

	constructor(app: Express) {
		this.prefix = "/";
		this.app = app;
		this._controllers = [];
		this.middlewares = [];
		this._plugins = [];
	}

	withPrefix(prefix: string) {
		this.prefix = prefix;
		return this;
	}

	plugins(plugins: Plugin[]) {
		this._plugins = plugins;
		return this;
	}

	controllers(controllers: Controller[]) {
		this._controllers = controllers;
		return this;
	}

	withMiddlewares(middlewares: RequestHandler[]) {
		this.middlewares = middlewares;
		return this;
	}

	build(): ServerBuildType {
		if (!this.app) {
			error("RouterBuild requires app.");
			throw new Error("RouterBuild requires app.");
		}

		const routes = this._controllers.map((controller) => controller.route);
		const paths = this._controllers.flatMap((controller) => {
			return controller.paths.map((path) => ({
				...path,
				route: `${controller.key}${path.route}`,
				controllerPath: controller.key,
			}));
		});

		const prefix = this.prefix === "/" ? "" : this.prefix;

		for (const path of paths) {
			getStorage().routes.push({
				key: path.key,
				path: path.route,
				method: path.req as any,
				...(path.bodySchema && { bodySchema: path.bodySchema }),
				...(path.querySchema && { querySchema: path.querySchema }),
			});
			info(`${bold(path.key)} ${green(path.req)} ${prefix}${path.route}`);
		}

		for (const route of routes) {
			this.app.use(this.prefix, ...this.middlewares, route);
		}

		const formatedPaths = paths.map(
			(path) => `${path.req}${prefix}${path.route}`,
		);

		const pathsDuplicate = formatedPaths.filter(
			(key, index) => formatedPaths.indexOf(key) !== index,
		);

		if (pathsDuplicate.length) {
			throw new Error(`Duplicate routes found: ${pathsDuplicate.join(", ")}`);
		}

		const server = {
			app: this.app,
			controllers: this._controllers,
			paths,
			prefix,
		};

		for (const plugin of this._plugins) {
			plugin(server);
		}

		server.app.use((err, req, res, next) => {
			if (err instanceof PommeError) {
				res.status(err.statusCode).json({ error: err.message });
			} else if (err) {
				res.status(500).json({ error: err.message });
			}
			next();
		});

		return server;
	}

	static create(app: Express) {
		return new _MakeServer(app);
	}
}

export const server = _MakeServer.create;
