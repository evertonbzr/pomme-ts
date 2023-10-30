import { MainMetadata } from '../types';

class StorageEngine {
  public main: MainMetadata;

  constructor() {
    this.main = {
      modules: [],
    };
  }
}

let storage: StorageEngine;

export function getMetadataStorage() {
  if (!storage) {
    storage = new StorageEngine();
  }
  return storage;
}
