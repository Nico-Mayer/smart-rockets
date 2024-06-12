import { Graphics, Rectangle, Ticker } from 'pixi.js'
import 'pixi.js/math-extras'
import {
    APP,
    CAN_HEIGHT,
    CAN_WIDTH,
    POPULATION,
    mode,
    showQuadTree,
    updateMutationRate,
} from './globals'
import { QuadTree } from './lib/dataStructs/quadTree'
import { ControlsUI } from './ui/controlsUi'
import { StatsIsland } from './ui/statsIsland'

const STATS_ISLAND = new StatsIsland()
const CONTROLS_UI = new ControlsUI()

let prevMode: string = 'sim'

;(async () => {
    // Initialize app
    await APP.init({
        antialias: true,
        width: CAN_WIDTH,
        height: CAN_HEIGHT,
        backgroundAlpha: 0,
    })

    mode.addListener((mode) => {
        switch (mode) {
            case 'sim':
                APP.stage.eventMode = 'none'
                APP.stage.hitArea = null
                break
            case 'edit':
                APP.stage.eventMode = 'static'
                APP.stage.hitArea = APP.screen
                break
        }
    })

    document.body.appendChild(APP.canvas)

    // Initialize UI controls
    CONTROLS_UI.init()

    // Initialize QuadTree visualizer
    const QUAD_TREE_VISUALIZER = new Graphics()
    APP.stage.addChild(QUAD_TREE_VISUALIZER)

    // Timing variables
    const UPDATE_INTERVAL = 1000 / 60 // 60 times per second
    let elapsedUpdate = 0.0
    let lastUpdate = performance.now()

    APP.ticker.add((ticker) => {
        const CURR_TIME = performance.now()
        const DELTA_TIME_UPDATE = CURR_TIME - lastUpdate
        lastUpdate = CURR_TIME

        elapsedUpdate += DELTA_TIME_UPDATE

        if (elapsedUpdate >= UPDATE_INTERVAL) {
            handleUpdate(ticker)
            elapsedUpdate = 0
        }
    })

    function handleUpdate(ticker: Ticker) {
        STATS_ISLAND.update(ticker)

        const GEN_FINISHED = POPULATION.checkIfGenerationFinished()

        let qt: QuadTree | null = null
        if (showQuadTree.value) {
            qt = new QuadTree(new Rectangle(0, 0, CAN_WIDTH, CAN_HEIGHT), 1)
        }

        switch (mode.value) {
            case 'sim':
                if (qt) {
                    POPULATION.rockets.forEach((rocket) => {
                        qt.insert(rocket.position)
                    })

                    QUAD_TREE_VISUALIZER.clear()
                    if (showQuadTree.value) {
                        qt.show(QUAD_TREE_VISUALIZER)
                    }
                } else {
                    QUAD_TREE_VISUALIZER.clear()
                }

                if (GEN_FINISHED) {
                    POPULATION.evaluate()
                    POPULATION.selection()
                    updateMutationRate()
                    POPULATION.nextGeneration()
                }

                POPULATION.update()
                prevMode = 'sim'
                break
            case 'edit':
                if (prevMode !== 'edit') {
                    QUAD_TREE_VISUALIZER.clear()
                }

                prevMode = 'edit'
                break
            case 'pause':
                break
        }
    }
})()
