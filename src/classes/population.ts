import { generation, populationSize } from '../globals'
import { randomColor, randomIndex } from '../utils'
import { DNA } from './dna'
import { Rocket } from './rocket'

export class RocketPopulation {
    rockets: Rocket[] = []
    size: number = populationSize.get()
    matingPool: Rocket[] = []
    avgFitness: number = 0
    pickRate: number = 0.01

    constructor() {
        for (let i = 0; i < this.size; i++) {
            this.rockets[i] = new Rocket(new DNA([], randomColor(), randomColor()))
        }
    }

    render() {
        for (let i = 0; i < this.size; i++) {
            this.rockets[i].render()
        }
    }

    update() {
        for (let i = 0; i < this.size; i++) {
            this.rockets[i].update()
        }
    }

    changePopulationSize(newSize: number) {
        const OLD_SIZE = this.size
        const DELTA = newSize - OLD_SIZE
        this.size = newSize

        if (DELTA > 0) {
            for (let i = 0; i < DELTA; i++) {
                const NEW_ROCKET = new Rocket(new DNA([], randomColor(), randomColor()))
                this.rockets.push(NEW_ROCKET)
            }
        } else {
            for (let i = 0; i < -DELTA; i++) {
                const ROCKET_TO_REMOVE = this.rockets.pop()
                if (ROCKET_TO_REMOVE) {
                    ROCKET_TO_REMOVE.removeFromStage()
                }
            }
        }
    }

    reset() {
        for (let i = 0; i < this.size; i++) {
            this.rockets[i].removeFromStage()
        }

        this.size = populationSize.get()
        this.avgFitness = 0
        this.matingPool = []
        this.rockets = []

        for (let i = 0; i < this.size; i++) {
            this.rockets[i] = new Rocket(new DNA([], randomColor(), randomColor()))
        }
    }

    evaluate() {
        const MATING_POOL_SIZE_FACTOR = this.getSelectionPressure()

        let totalPopulationFitness = 0
        let maxFit = 0

        this.rockets.forEach((rocket) => {
            rocket.calcFitness()
            totalPopulationFitness += rocket.fitness
            maxFit = Math.max(maxFit, rocket.fitness)
        })

        this.rockets.forEach((rocket) => {
            rocket.fitness /= maxFit
        })

        this.matingPool = []

        for (let i = 0; i < this.size; i++) {
            const TIMES_TO_ADD_TO_POOL = this.rockets[i].fitness * MATING_POOL_SIZE_FACTOR
            for (let j = 0; j < TIMES_TO_ADD_TO_POOL; j++) {
                this.matingPool.push(this.rockets[i])
            }
        }

        if (this.matingPool.length === 0) {
            this.matingPool = this.rockets.slice()
        }

        this.avgFitness = totalPopulationFitness / this.size
    }

    getSelectionPressure() {
        // Example strategy: linearly increase factor over generations
        const INITIAL = 50
        const FINAL = 200
        const MAX_GEN = 100

        return INITIAL + (FINAL - INITIAL) * Math.min(generation.get() / MAX_GEN, 1)
    }

    selection() {
        const BEST_ROCKETS = this.chooseBest()
        const BEST_ROCKETS_LENGTH = BEST_ROCKETS.length
        const ROCKETS_LENGTH = this.rockets.length
        const NEW_DNA = new Array(ROCKETS_LENGTH)

        BEST_ROCKETS.forEach((rocket, i) => {
            NEW_DNA[i] = rocket.dna
            NEW_DNA[i].isBest = true
        })

        for (let i = BEST_ROCKETS_LENGTH; i < ROCKETS_LENGTH; i++) {
            const PARENT_A = this.matingPool[randomIndex(this.matingPool.length)].dna
            const PARENT_B = this.matingPool[randomIndex(this.matingPool.length)].dna

            const CHILD_DNA = PARENT_A.crossover(PARENT_B)
            CHILD_DNA.mutation()
            NEW_DNA[i] = CHILD_DNA
        }

        for (let i = 0; i < ROCKETS_LENGTH; i++) {
            const ROCKET = this.rockets[i]
            ROCKET.dna = NEW_DNA[i]
            ROCKET.reset()
        }
    }

    chooseBest(): Rocket[] {
        // TODO: Implement PriorityQueue approach
        const MINIMUM_PICKED = 1
        const AMOUNT_PICKED = Math.max(MINIMUM_PICKED, Math.floor(this.size * this.pickRate))
        const SORTED_ROCKETS = this.rockets.slice().sort((a, b) => b.fitness - a.fitness)
        const BEST_ROCKETS = SORTED_ROCKETS.slice(0, AMOUNT_PICKED)

        return BEST_ROCKETS
    }
}
