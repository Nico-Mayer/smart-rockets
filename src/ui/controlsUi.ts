import {
    POPULATION,
    darkMode,
    mode,
    populationSize,
    showDistance,
    showQuadTree,
    showTargetLine,
    showTrail,
} from '../globals'

export class ControlsUI {
    playPauseButton: HTMLButtonElement | null = null
    editButton: HTMLButtonElement | null = null
    themeToggle: HTMLInputElement | null = null

    distCheckbox: HTMLInputElement | null = null
    trailCheckbox: HTMLInputElement | null = null
    targetLineCheckbox: HTMLInputElement | null = null
    qtCheckbox: HTMLInputElement | null = null
    populationSizeInput: HTMLSelectElement | null = null

    constructor() {
        this.playPauseButton = document.querySelector('#play-pause-button')
        this.editButton = document.querySelector('#edit-button')
        this.themeToggle = document.querySelector('#theme-toggle')
        this.distCheckbox = document.querySelector('#dist-checkbox')
        this.trailCheckbox = document.querySelector('#trail-checkbox')
        this.targetLineCheckbox = document.querySelector('#target-line-checkbox')
        this.qtCheckbox = document.querySelector('#qt-checkbox')
        this.populationSizeInput = document.querySelector('#population-size-input')
    }

    init() {
        this.setupPlayPauseButton()
        this.setupEditButton()
        this.setupThemeToggle()
        this.setupDistCheckbox()
        this.setupTrailCheckbox()
        this.setupTargetLineCheckbox()
        this.setupQuadTreeCheckbox()
        this.setupPopulationSizeInput()
    }

    setupPlayPauseButton() {
        if (!this.playPauseButton) return
        const ICONS = this.playPauseButton.querySelectorAll('.btn-icon')
        const PLAY_ICON = ICONS[0]
        const PAUSE_ICON = ICONS[1]

        this.playPauseButton.addEventListener('click', () => {
            if (mode.value === 'sim') {
                mode.value = 'pause'
            } else {
                mode.value = 'sim'
            }
        })

        mode.addListener((gameMode) => {
            if (gameMode === 'sim') {
                PLAY_ICON.classList.add('hidden')
                PAUSE_ICON.classList.remove('hidden')
                this.playPauseButton?.classList.add('btn-success')
            } else if (gameMode === 'pause' || gameMode === 'edit') {
                PLAY_ICON.classList.remove('hidden')
                PAUSE_ICON.classList.add('hidden')
                this.playPauseButton?.classList.remove('btn-success')
            }
        })
    }

    setupEditButton() {
        if (!this.editButton) return

        this.editButton.addEventListener('click', () => {
            mode.value = 'edit'
        })

        mode.addListener((gameMode) => {
            if (gameMode === 'edit') {
                this.editButton?.classList.add('btn-success')
            } else {
                this.editButton?.classList.remove('btn-success')
            }
        })
    }

    setupDistCheckbox() {
        if (!this.distCheckbox) return
        this.distCheckbox.checked = showDistance.value
        this.distCheckbox?.addEventListener('change', this.toggleShowDist)
    }

    setupTargetLineCheckbox() {
        if (!this.targetLineCheckbox) return
        this.targetLineCheckbox.checked = showTargetLine.value
        this.targetLineCheckbox?.addEventListener('change', this.toggleShowTargetLine)
    }

    setupThemeToggle() {
        if (!this.themeToggle) return
        this.themeToggle.checked = darkMode.value
        this.themeToggle?.addEventListener('change', this.toggleTheme)
    }

    setupQuadTreeCheckbox() {
        if (!this.qtCheckbox) return
        this.qtCheckbox.checked = showQuadTree.value
        this.qtCheckbox?.addEventListener('change', this.toggleShowQuadTree)
    }

    setupTrailCheckbox() {
        if (!this.trailCheckbox) return
        this.trailCheckbox.checked = showTrail.value
        this.trailCheckbox?.addEventListener('change', this.toggleShowTrail)
    }

    setupPopulationSizeInput() {
        if (!this.populationSizeInput) return

        this.populationSizeInput.value = populationSize.value.toString()

        this.populationSizeInput.addEventListener('change', () => {
            populationSize.value = parseInt(this.populationSizeInput!.value)
            POPULATION.changePopulationSize(populationSize.value)
        })
    }

    toggleShowDist = () => {
        if (!this.distCheckbox) return
        showDistance.value = this.distCheckbox.checked
    }

    toggleShowTrail = () => {
        if (!this.trailCheckbox) return
        showTrail.value = this.trailCheckbox.checked
    }

    toggleShowTargetLine = () => {
        if (!this.targetLineCheckbox) return
        showTargetLine.value = this.targetLineCheckbox.checked
    }

    toggleShowQuadTree = () => {
        if (!this.qtCheckbox) return
        showQuadTree.value = this.qtCheckbox?.checked
    }

    toggleTheme = () => {
        if (!this.themeToggle) return
        darkMode.value = this.themeToggle.checked
    }
}
