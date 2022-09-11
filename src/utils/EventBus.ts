type Handler<T = any> = (val: T) => void;

export class EventBus<Events extends Record<string, any>> {
  private map: Map<string, Set<Handler>> = new Map();

  public on<EventName extends keyof Events>(
    name: EventName,
    handler: Handler<Events[EventName]>
  ) {
    let set: Set<Handler<Events[EventName]>> | undefined = this.map.get(
      name as string
    );
    if (!set) {
      set = new Set();
      this.map.set(name as string, set);
    }
    set.add(handler);
  }

  emit<EventName extends keyof Events>(
    name: EventName,
    value: Events[EventName]
  ) {
    const set: Set<Handler<Events[EventName]>> | undefined = this.map.get(
      name as string
    );
    if (!set) return;
    const copied = [...set];
    copied.forEach((fn) => fn(value));
  }
  off(): void;
  off<EventName extends keyof Events>(name: EventName): void;
  off<EventName extends keyof Events>(
    name: EventName,
    handler: Handler<Events[EventName]>
  ): void;

  off<EventName extends keyof Events>(
    name?: EventName,
    handler?: Handler<Events[EventName]>
  ): void {
    if (!name) {
      this.map.clear();
      return;
    }

    if (!handler) {
      this.map.delete(name as string);
      return;
    }

    const handlers: Set<Handler<Events[EventName]>> | undefined = this.map.get(
      name as string
    );
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
  }
}
