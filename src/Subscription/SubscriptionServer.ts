import { createDecorator, IInstantiationService } from 'yuzhi/instantiation/common/instantiation';
import { Subscription } from './Subscription';

export interface ISubscriptionServer {

    readonly _serviceBrand: undefined;

    addSubscription(id: number): Subscription;
    removeSubscription(subscription: Subscription): void;
    getSubscriptions(): Subscription[];
    getSubscription(id: number): Subscription;
    getSubscriptionByTopic(topic: string): Subscription;
}

export const ISubscriptionServer = createDecorator<ISubscriptionServer>("ISubscriptionServer");

export class SubscriptionServer implements ISubscriptionServer {

    declare _serviceBrand: undefined;

    private subscriptions: Subscription[] = [];

    constructor(@IInstantiationService private instantiationService: IInstantiationService) { }

    addSubscription(id: number): Subscription {
        const sub = this.instantiationService.createInstance(Subscription, id);
        this.subscriptions.push(sub);
        return sub;
    }

    removeSubscription(subscription: Subscription): void {
        throw new Error("Method not implemented.");
    }

    getSubscriptions(): Subscription[] {
        throw new Error("Method not implemented.");
    }

    getSubscription(id: number): Subscription {
        throw new Error("Method not implemented.");
    }

    getSubscriptionByTopic(topic: string): Subscription {
        throw new Error("Method not implemented.");
    }
}