type Listener<T> = (data: T) => void

export class Signal<T> {
    private listeners: Set<Listener<T>> = new Set()
    private _value: T

    constructor(value: T) {
        this._value = value
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        this.emit(value)
    }

    addListener(listener: Listener<T>): void {
        this.listeners.add(listener)
    }

    removeListener(listener: Listener<T>): void {
        this.listeners.delete(listener)
    }

    private emit(newValue: T): void {
        if (this._value === newValue) return
        this._value = newValue
        const LISTENERS_COPY = Array.from(this.listeners)
        LISTENERS_COPY.forEach((listener) => listener(newValue))
    }
}

export class PersistedSignal<T> extends Signal<T> {
    private _key: string

    constructor(key: string, defaultValue: T) {
        super(localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : defaultValue)
        this._key = key
    }

    get value(): T {
        return super.value
    }

    set value(value: T) {
        super.value = value
        localStorage.setItem(this._key, JSON.stringify(value))
    }
}
