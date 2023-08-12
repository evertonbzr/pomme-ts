import fs from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { BinaryToTextEncoding } from 'crypto';
import { ServerBuildType } from './types';

class Generator {
  private dirPath: string;
  private folderName: string;
  private paths: string[];
  private limit: number;

  constructor() {
    this.dirPath = process.cwd();
    this.paths = [];
    this.folderName = 'routes-output';
  }

  private generateChecksum(
    str: string,
    algorithm: string | null,
    encoding: BinaryToTextEncoding | null,
  ) {
    return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex');
  }

  setDirPath(path: string) {
    this.dirPath = path;
    return this;
  }

  setPaths(paths: string[]) {
    this.paths = paths;
    return this;
  }
  setLimit(limit = 30) {
    this.limit = limit;
    return this;
  }

  getByChecksum(checksum: string) {
    const routesPath = path.join(
      `${this.dirPath}/${this.folderName}`,
      'routes.json',
    );

    if (!fs.existsSync(routesPath)) {
      return null;
    }

    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));

    return routes[checksum];
  }

  getLastPayload() {
    const routesPath = path.join(
      `${this.dirPath}/${this.folderName}`,
      'routes.json',
    );

    if (!fs.existsSync(routesPath)) {
      return null;
    }

    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));

    const lastChecksum = fs.readFileSync(
      path.join(`${this.dirPath}/${this.folderName}`, 'last-checksum.txt'),
      {
        encoding: 'utf-8',
      },
    );

    return routes[lastChecksum];
  }

  build() {
    const { dirPath, folderName, paths, limit } = this;
    fs.mkdirSync(`${dirPath}/${folderName}`, { recursive: true });

    let routes: {
      [key: string]: {
        createdAt: string;
        payload: string[];
      };
    } = {};

    const routesPath = path.join(`${dirPath}/${folderName}`, 'routes.json');

    if (fs.existsSync(routesPath)) {
      routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    }

    const checksumPaths = this.generateChecksum(
      JSON.stringify(paths).trim(),
      'md5',
      'hex',
    );

    fs.writeFileSync(
      path.join(`${dirPath}/${folderName}`, 'last-checksum.txt'),
      checksumPaths,
      {
        encoding: 'utf-8',
      },
    );

    if (routes[checksumPaths]) {
      return;
    }

    if (Object.keys(routes).length >= limit) {
      const firstKey = Object.keys(routes)[0];
      delete routes[firstKey];
    }

    routes[checksumPaths] = {
      payload: paths,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2), {
      encoding: 'utf-8',
    });
  }
}

export function generateRoutesOutput(
  server: ServerBuildType,
  options?: {
    homeWithLastChecksum?: boolean;
    limit?: number;
  },
) {
  const generator = new Generator();

  let homeWithLastChecksum = false;
  let limit = 30;

  if (options) {
    homeWithLastChecksum = options.homeWithLastChecksum || false;
    limit = options.limit || 30;
  }

  const { paths, prefix, app } = server;

  const formatedPaths = paths.map((path) => {
    const req = `<@req>${path.req}</@req>`;
    const route = `<@route>${prefix}${path.route}</@route>`;
    const key = `<@key>${path.key}</@key>`;
    const bodySchema = path.bodySchema
      ? `<@body>${path.bodySchema}</@body>`
      : '';
    const querySchema = path.querySchema
      ? `<@query>${path.querySchema}</@query>`
      : '';

    return `${key}${req}${route}${bodySchema}${querySchema}`;
  });

  const pommePathFind = paths.find((path) =>
    ['/pomme', '/pomme/:id'].includes(path.route),
  );

  if (pommePathFind) {
    throw new Error('You cannot use /pomme as a route');
  }

  generator.setPaths(formatedPaths).setLimit(limit).build();

  if (homeWithLastChecksum) {
    app.get('/pomme', (req, res) => {
      const payload = generator.getLastPayload();

      if (!payload) {
        return res.status(404).json({
          error: 'Not found',
        });
      }

      return res.json(payload);
    });
  }

  app.get('/pomme/:id', (req, res) => {
    const { id } = req.params;

    const payload = generator.getByChecksum(id);

    if (!payload) {
      return res.status(404).json({
        error: 'Not found',
      });
    }

    return res.json(payload);
  });
}
