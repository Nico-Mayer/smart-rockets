export class MutableValue<T> {
    private _value: T
    constructor(value: T) {
        this._value = value
    }
    get(): T {
        return this._value
    }
    set(value: T): void {
        this._value = value
    }
}

export class PersistentMutableValue<T> extends MutableValue<T> {
    key: string
    constructor(key: string, defaultValue: T) {
        super(localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : defaultValue)
        this.key = key
    }
    set(value: T): void {
        super.set(value)
        localStorage.setItem(this.key, JSON.stringify(value))
    }
}