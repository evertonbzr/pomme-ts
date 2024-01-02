type PommeErrorArgs = {
	message: string;
};

export class PommeError {
	public readonly statusCode: number;
	public readonly message: string;

	constructor(message: string, statusCode = 400) {
		this.message = message;
		this.statusCode = statusCode;
	}
}

const clientErrors = {
	badRequest: (message = "Bad request") => {
		throw new PommeError(message, 400);
	},
	unauthorized: (message = "Unauthorized") => {
		throw new PommeError(message, 401);
	},
	forbidden: (message = "Forbidden") => {
		throw new PommeError(message, 403);
	},
	notFound: (message = "Not found") => {
		throw new PommeError(message, 404);
	},
	conflict: (message = "Conflict") => {
		throw new PommeError(message, 409);
	},
	tooManyRequests: (message = "Too many requests") => {
		throw new PommeError(message, 429);
	},
};

const serverErrors = {
	serverError: (message = "Internal server error") => {
		throw new PommeError(message, 500);
	},
	notImplemented: (message = "Not implemented") => {
		throw new PommeError(message, 501);
	},
	badGateway: (message = "Bad gateway") => {
		throw new PommeError(message, 502);
	},
	serviceUnavailable: (message = "Service unavailable") => {
		throw new PommeError(message, 503);
	},
	gatewayTimeout: (message = "Gateway timeout") => {
		throw new PommeError(message, 504);
	},
	httpVersionNotSupported: (message = "HTTP version not supported") => {
		throw new PommeError(message, 505);
	},
};

const redirectErrors = {
	permanentRedirect: (message = "Permanent redirect") => {
		throw new PommeError(message, 308);
	},
	temporaryRedirect: (message = "Temporary redirect") => {
		throw new PommeError(message, 307);
	},
	seeOther: (message = "See other") => {
		throw new PommeError(message, 303);
	},
	notModified: (message = "Not modified") => {
		throw new PommeError(message, 304);
	},
	useProxy: (message = "Use proxy") => {
		throw new PommeError(message, 305);
	},
	switchProxy: (message = "Switch proxy") => {
		throw new PommeError(message, 306);
	},
};

const error = {
	...clientErrors,
	...serverErrors,
	...redirectErrors,
	throw: (
		{ message, statusCode = 500 }: PommeErrorArgs & { statusCode?: number } = {
			message: "Internal server error",
		},
	) => {
		throw new PommeError(message, statusCode);
	},
};

export { error };
