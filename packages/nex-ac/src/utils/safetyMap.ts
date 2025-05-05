export class SafetyMap<K, V> {
  private readonly map;
  constructor(private readonly defaultValue: () => V) {
    this.map = new Map<K, V>();
  }

  get(key: K) {
    if (!this.map.has(key)) {
      this.map.set(key, this.defaultValue());
    }
    return this.map.get(key)!;
  }

  set(key: K, value: V) {
    return this.map.set(key, value);
  }

  clear() {
    return this.map.clear();
  }

  delete(key: K) {
    return this.map.delete(key);
  }
}
