class Controller implements ControllerMetadata {
  public pathName: string;
  routes: any[];

  constructor() {}
}

export const $controller = new Controller();
