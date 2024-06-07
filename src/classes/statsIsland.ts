import { Ticker } from 'pixi.js'
import {
    alive,
    completed,
    crashed,
    finished,
    generation,
    lifecycle,
    lifespan,
    mode,
    populationSize,
} from '../globals'

export class StatsIsland {
    private statsIsland: HTMLElement | null
    private updateCounter: number = 0
    private readonly UPDATE_INTERVAL: number = 4

    private fpsSpan: HTMLElement | null | undefined
    private modeSpan: HTMLElement | null | undefined
    private clearedSpan: HTMLElement | null | undefined
    private generationSpan: HTMLElement | null | undefined
    private sizeSpan: HTMLElement | null | undefined
    private lifecycleSpan: HTMLElement | null | undefined
    private aliveSpan: HTMLElement | null | undefined
    private crashedSpan: HTMLElement | null | undefined
    private completedSpan: HTMLElement | null | undefined
    private avgFitnessSpan: HTMLElement | null | undefined

    constructor() {
        this.statsIsland = document.querySelector('#stats-island')

        this.fpsSpan = this.statsIsland?.querySelector('#fps-span')
        this.modeSpan = this.statsIsland?.querySelector('#mode-span')
        this.clearedSpan = this.statsIsland?.querySelector('#cleared-span')
        this.generationSpan = this.statsIsland?.querySelector('#generation-span')
        this.sizeSpan = this.statsIsland?.querySelector('#size-span')
        this.lifecycleSpan = this.statsIsland?.querySelector('#lifecycle-span')
        this.aliveSpan = this.statsIsland?.querySelector('#alive-span')
        this.crashedSpan = this.statsIsland?.querySelector('#crashed-span')
        this.completedSpan = this.statsIsland?.querySelector('#completed-span')
        this.avgFitnessSpan = this.statsIsland?.querySelector('#avg-fitness-span')
    }

    update(ticker: Ticker): void {
        if (!this.statsIsland) return

        if (this.updateCounter >= this.UPDATE_INTERVAL) {
            this.updateFPS(ticker.FPS)
            this.updateMode()
            this.updateCleared()
            this.updateGeneration()
            this.updateSize()
            this.updateLifecycle()
            this.updateAlive()
            this.updateCrashed()
            this.updateCompleted()
            this.updateAvgFitness()

            this.updateCounter = 0
        }

        this.updateCounter++
    }

    private updateFPS(fps: number) {
        if (this.fpsSpan) this.fpsSpan.innerHTML = `${Math.round(fps)}`
    }

    private updateMode() {
        if (this.modeSpan) this.modeSpan.innerHTML = mode.get()
    }

    private updateCleared() {
        if (this.clearedSpan) this.clearedSpan.innerHTML = `${finished.get()}`
    }

    private updateGeneration() {
        if (this.generationSpan) this.generationSpan.innerHTML = `${generation.get()}`
    }

    private updateSize() {
        if (this.sizeSpan) this.sizeSpan.innerHTML = `${populationSize.get()}`
    }

    private updateLifecycle() {
        const PADDED_LIFECYCLE = lifecycle.get().toString().padStart(3, '0')
        if (this.lifecycleSpan)
            this.lifecycleSpan.innerHTML = `${PADDED_LIFECYCLE} / ${lifespan.get()}`
    }

    private updateAlive() {
        if (this.aliveSpan) this.aliveSpan.innerHTML = `${alive.get()}`
    }

    private updateCrashed() {
        if (this.crashedSpan) this.crashedSpan.innerHTML = `${crashed.get()}`
    }

    private updateCompleted() {
        if (this.completedSpan) this.completedSpan.innerHTML = `${completed.get()}`
    }

    private updateAvgFitness() {
        if (this.avgFitnessSpan) this.avgFitnessSpan.innerHTML = `0.0`
    }
}
