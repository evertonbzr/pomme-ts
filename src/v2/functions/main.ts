import { Express } from 'express';
import { Module } from './module';
import { MainMetadata } from '../types';
import { getMetadataStorage } from '../store';

class Main {
  protected modules: Module[];
  protected app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  private build(): MainMetadata {
    const modules = this.modules.map((module) => module.build());

    return {
      modules,
    };
  }

  public create({ modules }: { modules: Module[] }) {
    this.modules = modules;
    getMetadataStorage().main = this.build();

    return this.app;
  }
}

export const $main = (app: Express) => new Main(app);
