import {
  createDecorator,
  IInstantiationService,
} from "yuzhi/instantiation/common/instantiation";
import { Subscription } from "./Subscription";
import { MaxPriorityQueue } from "datastructures-js";
export interface ISubscriptionServer {
  readonly _serviceBrand: undefined;

  addSubscription(subscription: Subscription): Subscription;
  removeSubscription(subscription: Subscription): void;
  getSubscriptions(): Subscription[];
  getSubscription(id: Long): Subscription;
  getSubscriptionByTopic(topic: string): Subscription;
}

export const ISubscriptionServer = createDecorator<ISubscriptionServer>(
  "ISubscriptionServer"
);

export class SubscriptionServer implements ISubscriptionServer {
  declare _serviceBrand: undefined;

  private subscriptions: Map<string, MaxPriorityQueue<Subscription>> = new Map();

  constructor(
    @IInstantiationService private instantiationService: IInstantiationService
  ) { }

  addSubscription(subscription: Subscription): Subscription {
    let priorityQueue = this.subscriptions.get(subscription.subscript);
    if (priorityQueue == undefined) {
      priorityQueue = new MaxPriorityQueue<Subscription>({
        compare: (e1, e2) => e1.Unique().compare(e2.Unique()),
      });

      this.subscriptions.set(subscription.subscript, priorityQueue);
    }
    priorityQueue.enqueue(subscription);

    return subscription;
  }

  removeSubscription(subscription: Subscription): void {
    throw new Error("Method not implemented.");
  }

  getSubscriptions(): Subscription[] {
    throw new Error("Method not implemented.");
  }

  getSubscription(id: Long): Subscription {
    throw new Error("Method not implemented.");
  }

  getSubscriptionByTopic(topic: string): Subscription {
    throw new Error("Method not implemented.");
  }
}
