import { ServerBuildType } from './types';

export function merge(servers: ServerBuildType[]) {
  return {
    build() {
      for (const server of servers) {
      }
    },
  };
}
