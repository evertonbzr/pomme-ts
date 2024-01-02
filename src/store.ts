import { RouteDefinition } from "./types";

class StorageEngine {
	public routes: RouteDefinition[] = [];
}

let storage: StorageEngine;

export function getStorage() {
	if (!storage) {
		storage = new StorageEngine();
	}
	return storage;
}
