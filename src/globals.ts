/* eslint-disable */
import { Application, Point } from 'pixi.js'
import { ObstacleStore } from './lib/dataStructs/obstacleStore'
import { PersistedSignal, Signal } from './lib/dataStructs/signal'
import { Obstacle } from './lib/gameObjects/obstacle'
import { RocketPopulation } from './lib/gameObjects/population'

type GameMode = 'sim' | 'edit' | 'pause'

// Independent Constants
export const APP = new Application()
export const CAN_WIDTH = window.innerWidth
export const CAN_HEIGHT = window.innerHeight
export const BASE_MUTATION_RATE = 0.015
export const HIGH_MUTATION_INTERVAL = 10

// Signals
export const mode: Signal<GameMode> = new Signal('sim' as GameMode)
export const finished: Signal<boolean> = new Signal(false)
export const populationSize: Signal<number> = new PersistedSignal('populationSize', 350)
export const lifespan: Signal<number> = new PersistedSignal('lifespan', 800)

// Persistent Signals
export const darkMode: Signal<boolean> = new PersistedSignal('darkMode', checkIfDarkMode())
export const showTrail: Signal<boolean> = new PersistedSignal('showTrail', false)
export const showTargetLine: Signal<boolean> = new PersistedSignal('showTargetLine', false)
export const showDistance: Signal<boolean> = new PersistedSignal('showDist', false)
export const mutationRate: Signal<number> = new PersistedSignal('mutationRate', BASE_MUTATION_RATE)
export const showQuadTree: Signal<boolean> = new PersistedSignal('showQt', false)

// Dependent Constants
export const SPAWN_POS = new Point(CAN_WIDTH / 2, CAN_HEIGHT - 20)
export const POPULATION = new RocketPopulation(populationSize.value) // Dependent on populationSize and lifespan
export const OBSTACLE_STORE: ObstacleStore = new ObstacleStore() // Depends on darkMode (determines the color of the obstacles)

export const TARGET = new Obstacle({
    id: 'target',
    x: CAN_WIDTH / 2,
    y: 120,
    width: 60,
    height: 60,
    rotation: 0,
})

// Methods
function checkIfDarkMode() {
    const darkModeSetting = localStorage.getItem('darkMode')
    if (darkModeSetting !== null) {
        return darkModeSetting === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const updateMutationRate = () => {
    const BASE = 0.99
    const HIGH_MUTATION_INCREMENT = 0.03
    const FINISHED_MUTATION_FACTOR = 0.5

    let newMutationRate = BASE_MUTATION_RATE * Math.pow(BASE, POPULATION.generation)

    if (finished.value) {
        newMutationRate *= FINISHED_MUTATION_FACTOR
    }

    if (POPULATION.generation % HIGH_MUTATION_INTERVAL === 0 && POPULATION.generation !== 0) {
        newMutationRate += HIGH_MUTATION_INCREMENT
    }

    mutationRate.value = newMutationRate
}
