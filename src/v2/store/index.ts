interface ControllerMetadata {
  pathName: string;
  routes: any[];
}

interface MainMetadata {
  modules: ModuleMetadata[];
}

interface ModuleMetadata {
  controllers: ControllerMetadata[];
}

class StorageEngine {
  public main: MainMetadata;

  constructor() {
    this.main = {
      modules: [],
    };
  }
}

let storage: StorageEngine;

function getMetadataStorage() {
  if (!storage) {
    storage = new StorageEngine();
  }
  return storage;
}
