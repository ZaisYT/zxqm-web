class Queue {
  queue: string[];
  length: number;
  debug: boolean;

  constructor(queue: string[], debug: boolean) {
    this.queue = [];
    this.length = queue.length;
    this.debug = debug;
  }

  addSong(song: string) {
    if (this.debug) console.log(`[DEBUG] Adding song ${song} to queue`);
    this.queue.push(song);
    if (this.debug) console.log(`[DEBUG] The new queue is ${this.queue}`);
  }

  removeSong(index: number) {
    if (this.debug) console.log(`[DEBUG] Removing song at index ${index} from queue`);
    this.queue.splice(index, 1);
    if (this.debug) console.log(`[DEBUG] The new queue is ${this.queue}`);
  }

  getQueue() {
    if (this.debug) console.log(`[DEBUG] Getting queue`);
    if (this.debug) console.log(`[DEBUG] The queue is ${this.queue}`);
    return this.queue;
  }

  getLength() {
    if (this.debug) console.log(`[DEBUG] Getting queue length`);
    if (this.debug) console.log(`[DEBUG] The queue length is ${this.length}`);
    return this.length;
  }

  clearQueue() {
    if (this.debug) console.log(`[DEBUG] Clearing queue`);
    this.queue = [];
    if (this.debug) console.log(`[DEBUG] The new queue is ${this.queue}`);
  }

  setQueue(queue: string[]) {
    if (this.debug) console.log(`[DEBUG] Setting queue`);
    this.queue = queue;
    if (this.debug) console.log(`[DEBUG] The new queue is ${this.queue}`);
  }

}

export default Queue;