import { Point } from 'pixi.js'
import { lifespan, mutationRate } from '../../globals'
import { randomVector } from '../utils'

export class DNA {
    genes: Point[]
    bodyColor: string
    trailColor: string
    alpha: number = 150
    alphaTrail: number = 80
    isBest: boolean = false
    // highMutateGen: boolean = false

    constructor(genes: Point[] = [], bodyColor: string, trailColor: string) {
        this.genes = genes.length ? genes : this.generateGenes()
        this.bodyColor = bodyColor
        this.trailColor = trailColor
    }

    private generateGenes(): Point[] {
        return Array.from({ length: lifespan.value }, () => randomVector())
    }

    crossover(partner: DNA): DNA {
        const NEW_GENES = this.genes.map((gene, i) =>
            Math.random() > 0.5 ? gene : partner.genes[i]
        )
        return new DNA(NEW_GENES, this.bodyColor, partner.trailColor)
    }

    mutation() {
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < mutationRate.value) {
                this.genes[i] = randomVector()
            }
        }
    }
}
