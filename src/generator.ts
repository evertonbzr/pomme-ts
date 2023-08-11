import fs from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { BinaryToTextEncoding } from 'crypto';
import { Path, ServerBuildType } from './types';

class Generator {
  private dirPath: string;
  private folderName: string;
  private paths: string[];

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
    fs.mkdirSync(`${this.dirPath}/${this.folderName}`, { recursive: true });

    let routes: {
      [key: string]: {
        createdAt: string;
        payload: string[];
      };
    } = {};

    const routesPath = path.join(
      `${this.dirPath}/${this.folderName}`,
      'routes.json',
    );

    if (fs.existsSync(routesPath)) {
      routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    }

    const checksumPaths = this.generateChecksum(
      JSON.stringify(this.paths).trim(),
      'md5',
      'hex',
    );

    if (routes[checksumPaths]) {
      return;
    }

    routes[checksumPaths] = {
      payload: this.paths,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2), {
      encoding: 'utf-8',
    });

    fs.writeFileSync(
      path.join(`${this.dirPath}/${this.folderName}`, 'last-checksum.txt'),
      checksumPaths,
      {
        encoding: 'utf-8',
      },
    );
  }
}

export function generateRoutesOutput(
  server: ServerBuildType,
  options?: {
    homeWithLastChekcsum?: boolean;
  },
) {
  const generator = new Generator();

  let homeWithLastChekcsum = false;

  if (options) {
    homeWithLastChekcsum = options.homeWithLastChekcsum || false;
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

  generator.setPaths(formatedPaths).build();

  if (homeWithLastChekcsum) {
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
