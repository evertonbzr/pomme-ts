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
  badRequest: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 400);
  },
  unauthorized: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 401);
  },
  forbidden: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 403);
  },
  notFound: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 404);
  },
  conflict: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 409);
  },
  tooManyRequests: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 429);
  },
};

const serverErrors = {
  serverError: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 500);
  },
  notImplemented: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 501);
  },
  badGateway: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 502);
  },
  serviceUnavailable: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 503);
  },
  gatewayTimeout: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 504);
  },
  httpVersionNotSupported: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 505);
  },
};

const redirectErrors = {
  permanentRedirect: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 308);
  },
  temporaryRedirect: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 307);
  },
  seeOther: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 303);
  },
  notModified: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 304);
  },
  useProxy: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 305);
  },
  switchProxy: (args: PommeErrorArgs) => {
    throw new PommeError(args.message, 306);
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
