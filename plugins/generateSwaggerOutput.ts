import { ServerBuildType } from 'src/types';

type Options = {
  openapi: '3.0.0' | (string & {});
  info: {
    title: string;
    version: string;
    summary?: string;
    'x-logo'?: {
      url: string;
    };
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      identifier?: string;
      url?: string;
    };
  };
  servers: {
    url: string;
    description?: string;
  }[];
};

type MethodBody = {
  summary?: string;
  operationId?: string;
  tags?: string[];
  parameters?: {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
  }[];
};

type Methods =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | 'trace'
  | (string & {});

type Path = {
  [key in Methods]?: MethodBody;
};
type OpenAPIConfig = Options & {
  paths: Record<string, Path>;
};

const opt: Options = {
  openapi: '3.0.0',
  info: {
    title: 'Sample API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};
export const generateSwaggerOutput =
  (opts: Options) => (server: ServerBuildType) => {
    const { controllers, paths: serverPaths } = server;

    const allPaths = [...new Set(serverPaths.map((el) => el.route))];

    const paths = allPaths.reduce((acc, path) => {
      const controllerFind = controllers.filter((ctrl) =>
        path.startsWith(ctrl.key),
      );

      if (!controllerFind.length) {
        return acc;
      }

      const controller = controllerFind[0];
      const fields = controller.fields.filter(
        (el) => controller.key + el.path === path,
      );

      const tags = controllerFind
        .map((ctrl) => ctrl.key)
        .map((ctrl) => ctrl.replace('/', ''));

      const rootOperations = fields.map((field) => {
        return {
          [field.reqType.toLowerCase()]: {
            operationId: field.key,
            tags,
          },
        };
      });

      return {
        ...acc,
        [path]: {
          ...rootOperations.reduce((acc, el) => {
            return {
              ...acc,
              ...el,
            };
          }, {}),
        },
      };
    }, {});

    const openapi: OpenAPIConfig = {
      ...opts,
      paths,
    };
  };
