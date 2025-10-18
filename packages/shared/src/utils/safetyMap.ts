export class SafetyMap<K, V> {
  private readonly map = new Map<K, V>();
  constructor(private readonly defaultValue: () => V) {}

  get size() {
    return this.map.size;
  }

  get(key: K): V {
    if (!this.map.has(key)) {
      this.map.set(key, this.defaultValue());
    }
    return this.map.get(key)!;
  }

  set(key: K, value: V): this {
    this.map.set(key, value);
    return this;
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.map.forEach(callbackfn, thisArg);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.map[Symbol.iterator]();
  }
}
