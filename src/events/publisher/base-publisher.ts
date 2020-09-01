import { Stan } from 'node-nats-streaming';
import { Event } from '../events';

export abstract class BasePublisher<K, T extends Event<K>> {
  protected abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject.type, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}
