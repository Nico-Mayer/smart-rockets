/* eslint-disable */
import { Application, Point } from 'pixi.js'

import { MutableValue, PersistentMutableValue } from './lib/dataStructs/mutableValue'
import { ObstacleStore } from './lib/dataStructs/obstacleStore'
import { Signal } from './lib/dataStructs/signal'
import { Obstacle } from './lib/gameObjects/obstacle'
import { RocketPopulation } from './lib/gameObjects/population'

export const APP = new Application()


type GameMode = 'sim' | 'edit' | 'pause'






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

export const CAN_WIDTH = window.innerWidth
export const CAN_HEIGHT = window.innerHeight
export const SPAWN_POS = new Point(CAN_WIDTH / 2, CAN_HEIGHT - 20)
export const lifespan: MutableValue<number> = new MutableValue(800)

export const ROCKET_TRAIL_LENGTH = 25
export const populationSize: PersistentMutableValue<number> = new PersistentMutableValue(
    'populationSize',
    350
)
export const POPULATION = new RocketPopulation()

export const mode: Signal<GameMode> = new Signal('sim' as GameMode)

export const TARGET = new Obstacle({
    id: 'target',
    x: CAN_WIDTH / 2,
    y: 120,
    width: 60,
    height: 60,
})

export const BASE_MUTATION_RATE = 0.015
export const HIGH_MUTATION_INTERVAL = 10

export const finished: MutableValue<boolean> = new MutableValue(false)

export const showTrail: MutableValue<boolean> = new PersistentMutableValue('showTrail', false)
export const showTargetLine: MutableValue<boolean> = new PersistentMutableValue(
    'showTargetLine',
    false
)

export const showDistance: MutableValue<boolean> = new PersistentMutableValue('showDist', false)
export const OBSTACLE_STORE: ObstacleStore = new ObstacleStore()
export const mutationRate: MutableValue<number> = new MutableValue(BASE_MUTATION_RATE)

export const showQuadTree: MutableValue<boolean> = new PersistentMutableValue('showQt', false)

// Methods
export const rocketCollided = (): void => {
    POPULATION.crashed++
    POPULATION.alive--
}

export const rocketCompleted = (): void => {
    POPULATION.completed++
    if (!finished.get()) {
        finished.set(true)
    }
}

export const nextGeneration = (): void => {
    POPULATION.generation++
    POPULATION.lifecycle = 0
    POPULATION.alive = populationSize.get()
    POPULATION.crashed = 0
    POPULATION.completed = 0
}

export const restartSimulation = (): void => {
    POPULATION.generation = 0
    POPULATION.lifecycle = 0
    POPULATION.alive = populationSize.get()
    POPULATION.crashed = 0
    POPULATION.completed = 0
    finished.set(false)
    POPULATION.reset()
}

export const updateMutationRate = () => {
    const BASE = 0.99
    const HIGH_MUTATION_INCREMENT = 0.03
    const FINISHED_MUTATION_FACTOR = 0.5

    let newMutationRate = BASE_MUTATION_RATE * Math.pow(BASE, POPULATION.generation)

    if (finished.get()) {
        newMutationRate *= FINISHED_MUTATION_FACTOR
    }

    if (POPULATION.generation % HIGH_MUTATION_INTERVAL === 0 && POPULATION.generation !== 0) {
        newMutationRate += HIGH_MUTATION_INCREMENT
    }

    mutationRate.set(newMutationRate)
}
