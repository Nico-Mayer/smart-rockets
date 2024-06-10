/* eslint-disable */
import { Point } from 'pixi.js'
import { Obstacle } from './classes/obstacle'
import { RocketPopulation } from './classes/population'

export type GameMode = 'sim' | 'edit' | 'stop'

class MutableValue<T> {
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

class MutableNumber extends MutableValue<number> {
    constructor(value: number) {
        super(value)
    }
    increment(): void {
        this.set(this.get() + 1)
    }
    decrement(): void {
        this.set(this.get() - 1)
    }
}

class PersistentMutableValue<T> extends MutableValue<T> {
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

type Listener<T> = (data: T) => void

class Signal<T> {
    private listeners: Listener<T>[] = []
    value: T

    constructor(value: T) {
        this.value = value
    }

    addListener(listener: Listener<T>): void {
        this.listeners.push(listener)
    }

    removeListener(listener: Listener<T>): void {
        const index = this.listeners.indexOf(listener)
        if (index !== -1) {
            this.listeners.splice(index, 1)
        }
    }

    emit(data: T): void {
        this.listeners.forEach((listener) => listener(data))
        this.value = data
    }
}

export const darkMode: Signal<boolean> = new Signal(checkIfDarkMode())

function checkIfDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode')
        document.body.classList.remove('light-mode')
        return true
    } else {
        document.body.classList.add('light-mode')
        document.body.classList.remove('dark-mode')
        return false
    }
}

export const settingsOpen: MutableValue<boolean> = new PersistentMutableValue('settingsOpen', false)

export const CAN_WIDTH = window.innerWidth
export const CAN_HEIGHT = window.innerHeight
export const SPAWN_POS = new Point(CAN_WIDTH / 2, CAN_HEIGHT - 20)
export const lifespan: MutableNumber = new MutableNumber(800)
export const lifecycle: MutableNumber = new MutableNumber(0)
export const ROCKET_TRAIL_LENGTH = 25
export const populationSize: PersistentMutableValue<number> = new PersistentMutableValue(
    'populationSize',
    350
)
export const POPULATION = new RocketPopulation()

export const mode: Signal<GameMode> = new Signal('sim' as GameMode)

export const TARGET = new Obstacle(new Point(CAN_WIDTH / 2, 120), 60, 60)

export const alive: MutableNumber = new MutableNumber(populationSize.get())
export const crashed: MutableNumber = new MutableNumber(0)
export const completed: MutableNumber = new MutableNumber(0)
export const BASE_MUTATION_RATE = 0.015
export const HIGH_MUTATION_INTERVAL = 10

export const finished: MutableValue<boolean> = new MutableValue(false)
export const generation: MutableNumber = new MutableNumber(0)
export const showTrail: MutableValue<boolean> = new PersistentMutableValue('showTrail', false)
export const showTargetLine: MutableValue<boolean> = new PersistentMutableValue(
    'showTargetLine',
    false
)

export const showDistance: MutableValue<boolean> = new PersistentMutableValue('showDist', false)
export const OBSTACLES: Obstacle[] = []
export const mutationRate: MutableNumber = new MutableNumber(BASE_MUTATION_RATE)

export const showQuadTree: MutableValue<boolean> = new PersistentMutableValue('showQt', false)

// Methods
export const rocketCollided = (): void => {
    crashed.increment()
    alive.decrement()
}

export const rocketCompleted = (): void => {
    completed.increment()
    if (!finished.get()) {
        finished.set(true)
    }
}

export const nextGeneration = (): void => {
    generation.increment()
    lifecycle.set(0)
    alive.set(populationSize.get())
    crashed.set(0)
    completed.set(0)
}

export const restartSimulation = (): void => {
    generation.set(0)
    lifecycle.set(0)
    alive.set(populationSize.get())
    crashed.set(0)
    completed.set(0)
    finished.set(false)
    POPULATION.reset()
}

export const updateMutationRate = () => {
    const BASE = 0.99
    const HIGH_MUTATION_INCREMENT = 0.03
    const FINISHED_MUTATION_FACTOR = 0.5

    let newMutationRate = BASE_MUTATION_RATE * Math.pow(BASE, generation.get())

    if (finished.get()) {
        newMutationRate *= FINISHED_MUTATION_FACTOR
    }

    if (generation.get() % HIGH_MUTATION_INTERVAL === 0 && generation.get() !== 0) {
        newMutationRate += HIGH_MUTATION_INCREMENT
    }

    mutationRate.set(newMutationRate)
}
