import { Ticker } from 'pixi.js'
import { POPULATION, finished, lifespan, mode, mutationRate, populationSize } from '../globals'

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
    private mutationRateSpan: HTMLElement | null | undefined
    private selectionPressureSpan: HTMLElement | null | undefined

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
        this.mutationRateSpan = this.statsIsland?.querySelector('#mutation-rate-span')
        this.selectionPressureSpan = this.statsIsland?.querySelector('#selection-pressure-span')

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
            this.updateMutationRate()
            this.updateSelectionPressure()

            this.updateCounter = 0
        }

        this.updateCounter++
    }

    private updateFPS(fps: number) {
        if (this.fpsSpan) this.fpsSpan.innerHTML = `${Math.round(fps)}`
    }

    private updateMode() {
        if (this.modeSpan) this.modeSpan.innerHTML = mode.value
    }

    private updateCleared() {
        if (this.clearedSpan) this.clearedSpan.innerHTML = `${finished.value}`
    }

    private updateGeneration() {
        if (this.generationSpan) this.generationSpan.innerHTML = `${POPULATION.generation}`
    }

    private updateSize() {
        if (this.sizeSpan) this.sizeSpan.innerHTML = `${populationSize.value}`
    }

    private updateLifecycle() {
        const PADDED_LIFECYCLE = POPULATION.lifecycle.toString().padStart(3, '0')
        if (this.lifecycleSpan)
            this.lifecycleSpan.innerHTML = `${PADDED_LIFECYCLE} / ${lifespan.value}`
    }

    private updateAlive() {
        if (this.aliveSpan) this.aliveSpan.innerHTML = `${POPULATION.alive}`
    }

    private updateCrashed() {
        if (this.crashedSpan) this.crashedSpan.innerHTML = `${POPULATION.crashed}`
    }

    private updateCompleted() {
        if (this.completedSpan) this.completedSpan.innerHTML = `${POPULATION.completed}`
    }

    private updateAvgFitness() {
        if (this.avgFitnessSpan)
            this.avgFitnessSpan.innerHTML = `${POPULATION.avgFitness.toFixed(2)}`
    }

    private updateMutationRate() {
        const MUTATION_RATE = (mutationRate.value * 100).toFixed(2)
        if (this.mutationRateSpan) this.mutationRateSpan.innerHTML = `${MUTATION_RATE}%`
    }

    private updateSelectionPressure() {
        const SELECTION_PRESSURE = POPULATION.getSelectionPressure()
        if (this.selectionPressureSpan)
            this.selectionPressureSpan.innerHTML = `${SELECTION_PRESSURE}`
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

            // Add the listeners for mousemove and mouseup
            document.addEventListener('mousemove', MOUSE_MOVE_HANDLER)
            document.addEventListener('mouseup', MOUSE_UP_HANDLER)
        }

        const MOUSE_MOVE_HANDLER = (event: MouseEvent) => {
            if (isDragging) {
                let NEW_LEFT = event.clientX - offsetX
                let NEW_TOP = event.clientY - offsetY

                // Get the width and height of the element
                const WIDTH = this.statsIsland!.offsetWidth
                const HEIGHT = this.statsIsland!.offsetHeight

                // Ensure the element stays within the window's bounds
                if (NEW_LEFT < 0) {
                    NEW_LEFT = 0
                } else if (NEW_LEFT + WIDTH > window.innerWidth) {
                    NEW_LEFT = window.innerWidth - WIDTH
                }

                if (NEW_TOP < 0) {
                    NEW_TOP = 0
                } else if (NEW_TOP + HEIGHT > window.innerHeight) {
                    NEW_TOP = window.innerHeight - HEIGHT
                }

                this.statsIsland!.style.left = `${NEW_LEFT}px`
                this.statsIsland!.style.top = `${NEW_TOP}px`
                this.statsIsland!.style.right = 'auto'
                this.statsIsland!.style.bottom = 'auto'
            }
        }

        const MOUSE_UP_HANDLER = () => {
            isDragging = false

            // Remove the listeners for mousemove and mouseup
            document.removeEventListener('mousemove', MOUSE_MOVE_HANDLER)
            document.removeEventListener('mouseup', MOUSE_UP_HANDLER)
        }

        const TITLE_BAR = this.statsIsland.querySelector('.collapse-title ') as HTMLElement

        TITLE_BAR?.addEventListener('mousedown', MOUSE_DOWN_HANDLER)
    }
}
