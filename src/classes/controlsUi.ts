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

    distCheckbox: HTMLInputElement | null = null
    trailCheckbox: HTMLInputElement | null = null
    targetLineCheckbox: HTMLInputElement | null = null
    qtCheckbox: HTMLInputElement | null = null
    darkModeCheckbox: HTMLInputElement | null = null
    populationSizeInput: HTMLSelectElement | null = null

    constructor() {
        this.playPauseButton = document.querySelector('#play-pause-button')
        this.editButton = document.querySelector('#edit-button')
        this.distCheckbox = document.querySelector('#dist-checkbox')
        this.trailCheckbox = document.querySelector('#trail-checkbox')
        this.targetLineCheckbox = document.querySelector('#target-line-checkbox')
        this.qtCheckbox = document.querySelector('#qt-checkbox')
        this.populationSizeInput = document.querySelector('#population-size-input')
        this.darkModeCheckbox = document.querySelector('#dark-mode-checkbox')
    }

    init() {
        this.setupPlayPauseButton()
        this.setupEditButton()
        this.setupDistCheckbox()
        this.setupTrailCheckbox()
        this.setupTargetLineCheckbox()
        this.setupQuadTreeCheckbox()
        this.setupDarkModeCheckbox()
        this.setupPopulationSizeInput()
    }

    setupPlayPauseButton() {
        if (!this.playPauseButton) return
        const ICONS = this.playPauseButton.querySelectorAll('.btn-icon')
        const PLAY_ICON = ICONS[0]
        const PAUSE_ICON = ICONS[1]

        this.playPauseButton.addEventListener('click', () => {
            mode.emit('sim')
        })

        mode.addListener((gameMode) => {
            if (gameMode === 'sim') {
                PLAY_ICON.classList.add('hidden')
                PAUSE_ICON.classList.remove('hidden')
                this.playPauseButton?.classList.add('btn-primary')
            } else {
                PLAY_ICON.classList.remove('hidden')
                PAUSE_ICON.classList.add('hidden')
                this.playPauseButton?.classList.remove('btn-primary')
            }
        })
    }

    setupEditButton() {
        if (!this.editButton) return

        this.editButton.addEventListener('click', () => {
            mode.emit('edit')
        })

        mode.addListener((gameMode) => {
            if (gameMode === 'edit') {
                this.editButton?.classList.add('btn-primary')
            } else {
                this.editButton?.classList.remove('btn-primary')
            }
        })
    }

    setupDistCheckbox() {
        if (!this.distCheckbox) return
        this.distCheckbox.checked = showDistance.get()
        this.distCheckbox?.addEventListener('change', this.toggleShowDist)
    }

    setupTargetLineCheckbox() {
        if (!this.targetLineCheckbox) return
        this.targetLineCheckbox.checked = showTargetLine.get()
        this.targetLineCheckbox?.addEventListener('change', this.toggleShowTargetLine)
    }

    setupDarkModeCheckbox() {
        if (!this.darkModeCheckbox) return
        this.darkModeCheckbox.checked = darkMode.value
        this.darkModeCheckbox?.addEventListener('change', this.toggleDarkMode)
    }

    setupQuadTreeCheckbox() {
        if (!this.qtCheckbox) return
        this.qtCheckbox.checked = showQuadTree.get()
        this.qtCheckbox?.addEventListener('change', this.toggleShowQuadTree)
    }

    setupTrailCheckbox() {
        if (!this.trailCheckbox) return
        this.trailCheckbox.checked = showTrail.get()
        this.trailCheckbox?.addEventListener('change', this.toggleShowTrail)
    }

    setupPopulationSizeInput() {
        if (!this.populationSizeInput) return

        /* mode.addListener((gameMode) => {
            if (gameMode === 'sim') {
                this.populationSizeInput!.disabled = true
            } else {
                this.populationSizeInput!.disabled = false
            }
        }) */

        this.populationSizeInput.value = populationSize.get().toString()

        this.populationSizeInput.addEventListener('change', () => {
            populationSize.set(parseInt(this.populationSizeInput!.value))
            POPULATION.changePopulationSize(populationSize.get())
        })
    }

    toggleShowDist = () => {
        if (!this.distCheckbox) return
        showDistance.set(this.distCheckbox.checked)
    }

    toggleShowTrail = () => {
        if (!this.trailCheckbox) return
        showTrail.set(this.trailCheckbox.checked)
    }

    toggleShowTargetLine = () => {
        if (!this.targetLineCheckbox) return
        showTargetLine.set(this.targetLineCheckbox.checked)
    }

    toggleShowQuadTree = () => {
        if (!this.qtCheckbox) return
        showQuadTree.set(this.qtCheckbox?.checked)
    }

    toggleDarkMode = () => {
        if (!this.darkModeCheckbox) return

        if (this.darkModeCheckbox.checked) {
            darkMode.emit(true)
            document.body.classList.add('dark-mode')
            document.body.classList.remove('light-mode')
            localStorage.setItem('darkMode', 'true')
        } else {
            darkMode.emit(false)
            document.body.classList.remove('dark-mode')
            document.body.classList.add('light-mode')
            localStorage.setItem('darkMode', 'false')
        }
    }
}
