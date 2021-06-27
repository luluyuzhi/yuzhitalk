
export interface IDstory {
    Destory: () => void;
}

export interface IUnique<T> {
    Unique: () => T;
}
export class SelfDictionary<U, T extends IUnique<U>> {
    private map = new Map();
    public set(value: T): IDstory {
        this.map.set(value.Unique(), value);
        return {
            Destory: () => {
                this.map.delete(value.Unique());
            }
        };
    }

    public has(key: U): boolean {
        return this.map.has(key);
    }

    public get(key: U) {
        return this.map.get(key);
    }
}