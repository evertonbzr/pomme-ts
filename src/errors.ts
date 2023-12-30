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
  badRequest: (message: string = 'Bad request') => {
    throw new PommeError(message, 400);
  },
  unauthorized: (message: string = 'Unauthorized') => {
    throw new PommeError(message, 401);
  },
  forbidden: (message: string = 'Forbidden') => {
    throw new PommeError(message, 403);
  },
  notFound: (message: string = 'Not found') => {
    throw new PommeError(message, 404);
  },
  conflict: (message: string = 'Conflict') => {
    throw new PommeError(message, 409);
  },
  tooManyRequests: (message: string = 'Too many requests') => {
    throw new PommeError(message, 429);
  },
};

const serverErrors = {
  serverError: (message: string = 'Internal server error') => {
    throw new PommeError(message, 500);
  },
  notImplemented: (message: string = 'Not implemented') => {
    throw new PommeError(message, 501);
  },
  badGateway: (message: string = 'Bad gateway') => {
    throw new PommeError(message, 502);
  },
  serviceUnavailable: (message: string = 'Service unavailable') => {
    throw new PommeError(message, 503);
  },
  gatewayTimeout: (message: string = 'Gateway timeout') => {
    throw new PommeError(message, 504);
  },
  httpVersionNotSupported: (message: string = 'HTTP version not supported') => {
    throw new PommeError(message, 505);
  },
};

const redirectErrors = {
  permanentRedirect: (message: string = 'Permanent redirect') => {
    throw new PommeError(message, 308);
  },
  temporaryRedirect: (message: string = 'Temporary redirect') => {
    throw new PommeError(message, 307);
  },
  seeOther: (message: string = 'See other') => {
    throw new PommeError(message, 303);
  },
  notModified: (message: string = 'Not modified') => {
    throw new PommeError(message, 304);
  },
  useProxy: (message: string = 'Use proxy') => {
    throw new PommeError(message, 305);
  },
  switchProxy: (message: string = 'Switch proxy') => {
    throw new PommeError(message, 306);
  },
};

const error = {
  ...clientErrors,
  ...serverErrors,
  ...redirectErrors,
  throw: (
    { message, statusCode = 500 }: PommeErrorArgs & { statusCode?: number } = {
      message: 'Internal server error',
    },
  ) => {
    throw new PommeError(message, statusCode);
  },
};

export { error };
