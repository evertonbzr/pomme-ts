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
  badRequest: (message: string) => {
    throw new PommeError(message, 400);
  },
  unauthorized: (message: string) => {
    throw new PommeError(message, 401);
  },
  forbidden: (message: string) => {
    throw new PommeError(message, 403);
  },
  notFound: (message: string) => {
    throw new PommeError(message, 404);
  },
  conflict: (message: string) => {
    throw new PommeError(message, 409);
  },
  tooManyRequests: (message: string) => {
    throw new PommeError(message, 429);
  },
};

const serverErrors = {
  serverError: (message: string) => {
    throw new PommeError(message, 500);
  },
  notImplemented: (message: string) => {
    throw new PommeError(message, 501);
  },
  badGateway: (message: string) => {
    throw new PommeError(message, 502);
  },
  serviceUnavailable: (message: string) => {
    throw new PommeError(message, 503);
  },
  gatewayTimeout: (message: string) => {
    throw new PommeError(message, 504);
  },
  httpVersionNotSupported: (message: string) => {
    throw new PommeError(message, 505);
  },
};

const redirectErrors = {
  permanentRedirect: (message: string) => {
    throw new PommeError(message, 308);
  },
  temporaryRedirect: (message: string) => {
    throw new PommeError(message, 307);
  },
  seeOther: (message: string) => {
    throw new PommeError(message, 303);
  },
  notModified: (message: string) => {
    throw new PommeError(message, 304);
  },
  useProxy: (message: string) => {
    throw new PommeError(message, 305);
  },
  switchProxy: (message: string) => {
    throw new PommeError(message, 306);
  },
};

const error = {
  ...clientErrors,
  ...serverErrors,
  ...redirectErrors,
  custom: ({
    message,
    statusCode = 500,
  }: PommeErrorArgs & { statusCode?: number }) => {
    throw new PommeError(message, statusCode);
  },
};

export { error };
