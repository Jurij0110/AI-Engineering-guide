export class EngineRegistry {
  #loaders = new Map();
  #cache = new Map();

  register(name, loader) {
    if (typeof name !== "string" || !name.trim() || typeof loader !== "function") {
      throw new TypeError("Engine name and loader are required");
    }
    if (this.#loaders.has(name)) {
      throw new Error("Engine already registered: " + name);
    }
    this.#loaders.set(name, loader);
  }

  has(name) {
    return this.#loaders.has(name);
  }

  load(name) {
    if (!this.#loaders.has(name)) {
      return Promise.reject(new Error("Unknown simulation engine: " + name));
    }
    if (!this.#cache.has(name)) {
      const loading = Promise.resolve()
        .then(() => this.#loaders.get(name)())
        .then(module => {
          if (typeof module?.createEngine !== "function") {
            throw new TypeError(name + " must export createEngine");
          }
          return module;
        })
        .catch(error => {
          this.#cache.delete(name);
          throw error;
        });
      this.#cache.set(name, loading);
    }
    return this.#cache.get(name);
  }
}

