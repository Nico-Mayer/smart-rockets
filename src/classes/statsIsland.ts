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

        this.makeDraggable()
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

    private makeDraggable() {
        if (!this.statsIsland) return

        let isDragging = false
        let offsetX: number, offsetY: number

        const MOUSE_DOWN_HANDLER = (event: MouseEvent) => {
            const RECT = this.statsIsland!.getBoundingClientRect()
            offsetX = event.clientX - RECT.left
            offsetY = event.clientY - RECT.top
            isDragging = true

            document.body.classList.add('no-select')

            // Add the listeners for mousemove and mouseup
            document.addEventListener('mousemove', MOUSE_MOVE_HANDLER)
            document.addEventListener('mouseup', MOUSE_UP_HANDLER)
        }

        const MOUSE_MOVE_HANDLER = (event: MouseEvent) => {
            if (isDragging) {
                const NEW_LEFT = event.clientX - offsetX
                const NEW_TOP = event.clientY - offsetY

                this.statsIsland!.style.left = `${NEW_LEFT}px`
                this.statsIsland!.style.top = `${NEW_TOP}px`
                this.statsIsland!.style.right = 'auto'
                this.statsIsland!.style.bottom = 'auto'
            }
        }

        const MOUSE_UP_HANDLER = () => {
            isDragging = false

            document.body.classList.remove('no-select')

            // Remove the listeners for mousemove and mouseup
            document.removeEventListener('mousemove', MOUSE_MOVE_HANDLER)
            document.removeEventListener('mouseup', MOUSE_UP_HANDLER)
        }

        this.statsIsland.addEventListener('mousedown', MOUSE_DOWN_HANDLER)
    }
}
