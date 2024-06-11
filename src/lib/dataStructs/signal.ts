type Listener<T> = (data: T) => void

export class Signal<T> {
    private listeners: Listener<T>[] = []
    value: T

    constructor(value: T) {
        this.value = value
    }

    addListener(listener: Listener<T>): void {
        this.listeners.push(listener)
    }

    removeListener(listener: Listener<T>): void {
        const INDEX = this.listeners.indexOf(listener)
        if (INDEX !== -1) {
            this.listeners.splice(INDEX, 1)
        }
    }

    emit(data: T): void {
        this.listeners.forEach((listener) => listener(data))
        this.value = data
    }
}