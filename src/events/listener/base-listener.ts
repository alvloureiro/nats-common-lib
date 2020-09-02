import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';
import { Event } from '../events';

export abstract class BaseListener<T, K extends Event<T>> {
  protected abstract subject: K['subject'];
  protected abstract queueGroupName: string;
  protected ackWaitTime: number = 10 * 1000;
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  private subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWaitTime)
      .setDurableName(this.queueGroupName);
  }

  private parseMessage(message: Message) {
    const data = message.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`> Message received from: ${this.subject}:${this.queueGroupName}`);
      const parsedMessage = this.parseMessage(msg);
      this.onMessage(parsedMessage, msg);
    });
  }

  protected abstract onMessage(data: K['data'], message: Message): void;
}
