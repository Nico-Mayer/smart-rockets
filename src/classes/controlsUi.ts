import {
    GameMode,
    POPULATION,
    darkMode,
    mode,
    populationSize,
    settingsOpen,
    showDistance,
    showQuadTree,
    showTargetLine,
    showTrail,
} from '../globals'

export class ControlsUI {
    dropDownCheckbox: HTMLInputElement | null = null
    dropdown: HTMLElement | null = null

    gameModeRadioGroup: HTMLDivElement | null = null

    distCheckbox: HTMLInputElement | null = null
    trailCheckbox: HTMLInputElement | null = null
    targetLineCheckbox: HTMLInputElement | null = null
    qtCheckbox: HTMLInputElement | null = null
    darkModeCheckbox: HTMLInputElement | null = null

    populationSizeInput: HTMLSelectElement | null = null

    constructor() {
        this.dropDownCheckbox = document.querySelector('#dropdown-checkbox')
        this.gameModeRadioGroup = document.querySelector('#game-mode-radio-group')
        this.dropdown = document.querySelector('#dropdown')
        this.distCheckbox = document.querySelector('#dist-checkbox')
        this.trailCheckbox = document.querySelector('#trail-checkbox')
        this.targetLineCheckbox = document.querySelector('#target-line-checkbox')
        this.qtCheckbox = document.querySelector('#qt-checkbox')
        this.darkModeCheckbox = document.querySelector('#dark-mode-checkbox')
        this.populationSizeInput = document.querySelector('#population-size-input')
    }

    init() {
        this.setupDropdownCheckbox()
        this.setupGameModeRadioGroup()
        this.setupDistCheckbox()
        this.setupTrailCheckbox()
        this.setupTargetLineCheckbox()
        this.setupQuadTreeCheckbox()
        this.setupDarkModeCheckbox()
        this.setupPopulationSizeInput()
    }

    setupDropdownCheckbox() {
        if (!this.dropDownCheckbox) return
        this.dropDownCheckbox.checked = settingsOpen.get()

        if (settingsOpen.get()) {
            this.dropdown?.classList.add('show')
            this.dropdown?.classList.remove('hide')
        } else {
            this.dropdown?.classList.add('hide')
            this.dropdown?.classList.remove('show')
        }

        this.dropDownCheckbox?.addEventListener('change', this.toggleDropdown)
    }

    setupGameModeRadioGroup() {
        if (!this.gameModeRadioGroup) return

        const BUTTONS = this.gameModeRadioGroup.querySelectorAll(
            'input[type="radio"]'
        ) as NodeListOf<HTMLInputElement>

        const SET_MODE = (btnElement: HTMLInputElement) => {
            const PARENT = btnElement.parentElement as HTMLDivElement
            if (btnElement.checked) {
                PARENT?.classList.add('active')
                mode.emit(btnElement.value as GameMode)
                BUTTONS.forEach((button) => {
                    if (button !== btnElement) {
                        button.parentElement?.classList.remove('active')
                    }
                })
            } else {
                PARENT?.classList.remove('active')
            }
        }

        BUTTONS.forEach((element) => {
            element?.addEventListener('change', () => SET_MODE(element))
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

    toggleDropdown = () => {
        if (this.dropDownCheckbox?.checked) {
            this.dropdown?.classList.add('show')
            this.dropdown?.classList.remove('hide')
            settingsOpen.set(true)
        } else {
            this.dropdown?.classList.add('hide')
            this.dropdown?.classList.remove('show')
            settingsOpen.set(false)
        }
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
