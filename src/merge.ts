import { ServerBuildType } from './types';

// work in progress
export function merge(servers: ServerBuildType[]) {
  return {
    build() {
      for (const server of servers) {
      }
    },
  };
}
