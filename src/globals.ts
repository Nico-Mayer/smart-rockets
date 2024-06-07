/* eslint-disable */
import { Assets, Point } from 'pixi.js'
import { Obstacle } from './classes/obstacle'

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

export const TRAIL_ASSET = await Assets.load('../../assets/trail.png')
export const CAN_WIDTH = window.innerWidth
export const CAN_HEIGHT = window.innerHeight
export const mode: MutableValue<GameMode> = new MutableValue('sim')
export const SPAWN_POS = new Point(CAN_WIDTH / 2, CAN_HEIGHT - 20)
export const TARGET = new Obstacle(new Point(CAN_WIDTH / 2, 120), 60, 60)
export const populationSize: MutableNumber = new MutableNumber(350)
export const alive: MutableNumber = new MutableNumber(populationSize.get())
export const crashed: MutableNumber = new MutableNumber(0)
export const completed: MutableNumber = new MutableNumber(0)
export const BASE_MUTATION_RATE = 0.001
export const BASE_MUTATION_INCREMENT = 0
export const HIGH_MUTATION_INTERVAL = 50
export const lifespan: MutableNumber = new MutableNumber(800)
export const lifecycle: MutableNumber = new MutableNumber(0)
export const finished: MutableValue<boolean> = new MutableValue(false)
export const generation: MutableNumber = new MutableNumber(0)
export const showTrail: MutableValue<boolean> = new MutableValue(true)
export const showTargetLine: MutableValue<boolean> = new MutableValue(false)
export const BASE_TRAIL_LENGTH = 40
export const showDistance: MutableValue<boolean> = new MutableValue(false)
export const OBSTACLES: Obstacle[] = []

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
export const restartSimulation = (): void => {
    generation.increment()
    lifecycle.set(0)
    alive.set(populationSize.get())
    crashed.set(0)
    completed.set(0)
}
