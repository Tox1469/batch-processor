/**
 * batch-processor — agrupa itens e dá flush por tamanho ou intervalo.
 */

export interface BatchProcessorOptions<T> {
  maxSize: number;
  maxWaitMs?: number;
  handler: (batch: T[]) => Promise<void> | void;
  onError?: (err: unknown, batch: T[]) => void;
}

export class BatchProcessor<T> {
  private buffer: T[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private flushing: Promise<void> = Promise.resolve();
  private closed = false;

  constructor(private readonly opts: BatchProcessorOptions<T>) {
    if (opts.maxSize <= 0) throw new Error("maxSize must be > 0");
  }

  get size(): number {
    return this.buffer.length;
  }

  push(item: T): void {
    if (this.closed) throw new Error("processor closed");
    this.buffer.push(item);
    if (this.buffer.length >= this.opts.maxSize) {
      void this.flush();
    } else if (this.opts.maxWaitMs && !this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        void this.flush();
      }, this.opts.maxWaitMs);
    }
  }

  pushAll(items: T[]): void {
    for (const it of items) this.push(it);
  }

  flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.buffer.length === 0) return this.flushing;
    const batch = this.buffer;
    this.buffer = [];
    this.flushing = this.flushing.then(async () => {
      try {
        await this.opts.handler(batch);
      } catch (err) {
        if (this.opts.onError) this.opts.onError(err, batch);
        else throw err;
      }
    });
    return this.flushing;
  }

  async close(): Promise<void> {
    this.closed = true;
    await this.flush();
    await this.flushing;
  }
}
