import { populationSize } from '../globals'
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

    evaluate() {
        const FITNESS_SCALING_FACTOR = 60

        let totalFitness = 0
        let maxFitness = 0

        this.rockets.forEach((rocket) => {
            rocket.calcFitness()
            totalFitness += rocket.fitness
            maxFitness = Math.max(maxFitness, rocket.fitness)
        })

        this.rockets.forEach((rocket) => {
            rocket.fitness /= maxFitness
        })

        this.matingPool = []

        for (let i = 0; i < this.size; i++) {
            const SELECTION_SIZE = this.rockets[i].fitness * FITNESS_SCALING_FACTOR
            for (let j = 0; j < SELECTION_SIZE; j++) {
                this.matingPool.push(this.rockets[i])
            }
        }

        if (this.matingPool.length === 0) {
            this.matingPool = this.rockets.slice()
        }

        this.avgFitness = totalFitness / this.size
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
