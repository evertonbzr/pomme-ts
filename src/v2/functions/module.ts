export class Module {
  public controllers: ControllerMetadata[] = [];

  static create() {
    return new Module();
  }

  public build(): ModuleMetadata {
    return {
      controllers: [],
    };
  }
}

export const $module = new Module();
