import { Ticker } from 'pixi.js'
import { lifecycle, lifespan, showDistance, showTargetLine, showTrail } from '../globals'

export class StatusBar {
    private htmlWrapper: HTMLDivElement | null
    private fpsWrapper: HTMLDivElement | null
    private lifecycleWrapper: HTMLDivElement | null
    private updateCounter: number = 0
    private readonly updateInterval: number = 10
    private showDistButton: HTMLButtonElement | null
    private showTrailButton: HTMLButtonElement | null
    private showTargetLineButton: HTMLButtonElement | null

    constructor() {
        this.htmlWrapper = document.querySelector('.status-bar')
        this.fpsWrapper = document.querySelector('.fps-wrapper')
        this.lifecycleWrapper = document.querySelector('.lifecycle-wrapper')
        this.showDistButton = document.querySelector('.show-dist')
        this.showTrailButton = document.querySelector('.show-trail')
        this.showTargetLineButton = document.querySelector('.show-target-line')

        if (this.showDistButton) {
            this.showDistButton.addEventListener('click', () => {
                showDistance.set(!showDistance.get())
            })
        }
        if (this.showTrailButton) {
            this.showTrailButton.addEventListener('click', () => {
                showTrail.set(!showTrail.get())
            })
        }

        if (this.showTargetLineButton) {
            this.showTargetLineButton.addEventListener('click', () => {
                showTargetLine.set(!showTargetLine.get())
            })
        }
    }

    update(ticker: Ticker): void {
        if (!this.htmlWrapper || !this.fpsWrapper || !this.lifecycleWrapper) {
            return
        }

        if (this.updateCounter >= this.updateInterval) {
            updateFps(this.fpsWrapper, ticker.FPS)
            updateLifecycle(this.lifecycleWrapper)
            this.updateCounter = 0
        }

        this.updateCounter++
    }
}

function updateFps(wrapper: HTMLDivElement, fps: number) {
    if (fps !== undefined) {
        wrapper.innerHTML = `FPS: ${Math.round(fps)}`
    }
}

function updateLifecycle(wrapper: HTMLDivElement) {
    const PADDED_LIFECYCLE = String(lifecycle.get()).padStart(3, '0')
    wrapper.innerHTML = `Lifecycle: ${PADDED_LIFECYCLE} / ${lifespan.get()} `
}
