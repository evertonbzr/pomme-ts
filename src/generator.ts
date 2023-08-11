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

export function generateRoutesOutput(server: ServerBuildType) {
  const generator = new Generator();

  const { paths, prefix } = server;

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

  generator.setPaths(formatedPaths).build();
}
