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

    fs.writeFileSync(
      path.join(`${this.dirPath}/${this.folderName}`, 'routes.txt'),
      this.paths.join('\n'),
      {
        encoding: 'utf-8',
      },
    );

    const file = fs.readFileSync(
      path.join(`${this.dirPath}/${this.folderName}`, 'routes.txt'),
      {
        encoding: 'utf-8',
      },
    );

    const checksum = this.generateChecksum(file, 'md5', 'hex');

    fs.writeFileSync(
      path.join(`${this.dirPath}/${this.folderName}`, 'checksum.txt'),
      checksum,
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
