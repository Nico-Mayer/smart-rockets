import { Graphics, Point, Rectangle, Ticker } from 'pixi.js'
import 'pixi.js/math-extras'
import { APP, getStage } from './app'

import { ControlsUI } from './classes/controlsUi'
import { Obstacle } from './classes/obstacle'
import { QuadTree } from './classes/quadTree'
import { StatsIsland } from './classes/statsIsland'
import {
    CAN_HEIGHT,
    CAN_WIDTH,
    OBSTACLES,
    POPULATION,
    alive,
    completed,
    crashed,
    lifecycle,
    lifespan,
    mode,
    nextGeneration,
    populationSize,
    restartSimulation,
    showQuadTree,
    updateMutationRate,
} from './globals'

let prevMode = 'sim'

;(async () => {
    // Initialize app
    await APP.init({
        antialias: true,
        width: CAN_WIDTH,
        height: CAN_HEIGHT,
        backgroundAlpha: 0,
    })
    document.body.appendChild(APP.canvas)

    // Initialize UI elements
    const STATS_ISLAND = new StatsIsland()
    const CONTROLS_UI = new ControlsUI()
    CONTROLS_UI.init()

    // Initialize QuadTree visualizer
    const QUAD_TREE_VISUALIZER = new Graphics()
    APP.stage.addChild(QUAD_TREE_VISUALIZER)

    // Timing variables
    const UPDATE_INTERVAL = 1000 / 60 // 60 times per second
    let elapsedUpdate = 0.0
    let lastUpdate = performance.now()

    // Add obstacles
    const OBS_1 = new Obstacle(new Point(1000, 400), 1500, 50)
    //const OBS_2 = new Obstacle(new Point(CAN_WIDTH, 800), 3500, 100)
    OBSTACLES.push(OBS_1)
    //OBSTACLES.push(OBS_2)

    APP.ticker.add((ticker) => {
        const CURR_TIME = performance.now()
        const DELTA_TIME_UPDATE = CURR_TIME - lastUpdate
        lastUpdate = CURR_TIME

        elapsedUpdate += DELTA_TIME_UPDATE

        if (elapsedUpdate >= UPDATE_INTERVAL) {
            handleUpdate(ticker)
            elapsedUpdate = 0
        }

        handleRender()
    })

    function handleUpdate(ticker: Ticker) {
        STATS_ISLAND.update(ticker)
        const END =
            lifecycle.get() === lifespan.get() ||
            alive.get() === 0 ||
            crashed.get() + completed.get() === populationSize.get()

        let qt: QuadTree | null = null
        if (showQuadTree.get()) {
            qt = new QuadTree(new Rectangle(0, 0, CAN_WIDTH, CAN_HEIGHT), 1)
        }

        switch (mode.value) {
            case 'sim':
                if (qt) {
                    POPULATION.rockets.forEach((rocket) => {
                        qt.insert(rocket.position)
                    })

                    QUAD_TREE_VISUALIZER.clear()
                    if (showQuadTree.get()) {
                        qt.show(QUAD_TREE_VISUALIZER)
                    }
                } else {
                    QUAD_TREE_VISUALIZER.clear()
                }

                if (END) {
                    POPULATION.evaluate()
                    POPULATION.selection()
                    updateMutationRate()
                    nextGeneration()
                }

                POPULATION.update()
                lifecycle.increment()
                prevMode = 'sim'
                break
            case 'edit':
                prevMode = 'edit'
                break
            case 'stop':
                if (prevMode !== 'stop') {
                    QUAD_TREE_VISUALIZER.clear()
                    restartSimulation()
                    getStage().removeAllListeners()
                }
                prevMode = 'stop'
                break
        }
    }

    function handleRender() {
        POPULATION.render()
    }
})()
