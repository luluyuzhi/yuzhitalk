import { IDisposable } from 'yuzhi/common/lifecycle';
import { IUnique } from 'yuzhi/utility/SelfDictionary';
import PriorityQueue from "priorityqueue";


interface ICycle<T, U> {
    timeout: number;
    value: number;
    id: U;
    box: T;
}

export interface ICycleElem<T> extends IDisposable, IUnique<T> { }


export class CycleService<U, T extends ICycleElem<U>> {

    private priorityQueue = new PriorityQueue<ICycle<T, U>>(
        { comparator: (a, b) => (a.value > b.value ? 1 : a.value < b.value ? -1 : 0) }
    );

    private cycleTimeout?: NodeJS.Timer;

    constructor(private timeout: number) {

    }

    setCycle(box: T): T {
        if (this.priorityQueue.length != 0) {
            this.initialize();
        }
        this.priorityQueue.push({
            timeout: this.timeout,
            value: Date.now(),
            id: box.Unique(),
            box
        });
        return box;
    }

    initialize(): void {
        const timeOut = () => {
            this.cycleTimeout = setTimeout(() => {

                while (this.priorityQueue.length > 0) {
                    let cycle = this.priorityQueue.top();
                    if (cycle.value + this.timeout < Date.now()) {
                        cycle.box.dispose();
                    } else {
                        break;
                    }
                }
                clearTimeout(this.cycleTimeout);
                if (this.priorityQueue.length != 0) {
                    timeOut();
                }
            }, this.timeout);
        };
        timeOut();
    }
};

