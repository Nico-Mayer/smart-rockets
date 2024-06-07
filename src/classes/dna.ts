import { Point } from 'pixi.js'
import {
    BASE_MUTATION_INCREMENT,
    BASE_MUTATION_RATE,
    HIGH_MUTATION_INTERVAL,
    finished,
    generation,
    lifespan,
} from '../globals'
import { randomColor, randomVector } from '../utils'

export class DNA {
    genes: Point[]
    bodyColor: string
    trailColor: string
    mutationRate: number
    alpha: number = 150
    alphaTrail: number = 80
    isBest: boolean = false
    colorMutate: boolean = false
    highMutateGen: boolean = false

    constructor(genes: Point[] = [], bodyColor: string, trailColor: string) {
        this.genes = genes.length ? genes : this.generateGenes()
        this.bodyColor = bodyColor
        this.trailColor = trailColor
        this.mutationRate = BASE_MUTATION_RATE
    }

    private generateGenes(): Point[] {
        return Array.from({ length: lifespan.get() }, () => randomVector())
    }

    crossover(partner: DNA): DNA {
        const NEW_GENES = this.genes.map((gene, i) =>
            Math.random() > 0.5 ? gene : partner.genes[i]
        )
        return new DNA(NEW_GENES, this.bodyColor, partner.trailColor)
    }

    mutation() {
        const COLOR_MUTATION_THRESHOLD = 0.008

        this.updateMutationRate()

        let mutated = 0
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < this.mutationRate) {
                this.genes[i] = randomVector()
                mutated++
            }
        }

        if (mutated > lifespan.get() * COLOR_MUTATION_THRESHOLD && !this.highMutateGen) {
            this.colorMutate = true
            this.bodyColor = randomColor()
            this.trailColor = randomColor()
        }
    }

    private updateMutationRate() {
        const GENERATION = generation.get()
        const FINISHED = finished.get()

        const HIGH_MUTATION_INCREMENT = 0.035

        this.mutationRate = FINISHED
            ? BASE_MUTATION_RATE / 3
            : BASE_MUTATION_RATE + BASE_MUTATION_INCREMENT * GENERATION

        if (GENERATION !== 0 && GENERATION % HIGH_MUTATION_INTERVAL === 0) {
            this.mutationRate += HIGH_MUTATION_INCREMENT
            this.highMutateGen = true
        }
    }
}
