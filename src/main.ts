import { Point, Ticker } from 'pixi.js'
import 'pixi.js/math-extras'
import { APP } from './app'
import { Obstacle } from './classes/obstacle'
import { RocketPopulation } from './classes/population'
import { StatsIsland } from './classes/statsIsland'
import { StatusBar } from './classes/statusBar'
import {
    CAN_HEIGHT,
    CAN_WIDTH,
    OBSTACLES,
    alive,
    completed,
    crashed,
    lifecycle,
    lifespan,
    mode,
    populationSize,
    restartSimulation,
} from './globals'

let prevMode = 'sim'

;(async () => {
    // Initialize app
    await APP.init({
        antialias: true,
        width: CAN_WIDTH,
        height: CAN_HEIGHT,
        backgroundAlpha: 0.25,
    })
    document.body.appendChild(APP.canvas)

    const POPULATION = new RocketPopulation()
    const STATUS_BAR = new StatusBar()
    const STATS_ISLAND = new StatsIsland()
    const UPDATE_INTERVAL = 1000 / 60 // 60 times per second

    let elapsedUpdate = 0.0
    let lastUpdate = performance.now()

    const OBS_1 = new Obstacle(new Point(0, 500), 4500, 100)
    OBSTACLES.push(OBS_1)

    APP.ticker.add((ticker) => {
        const CURR_TIME = performance.now()
        const DELTA_TIME_UPDATE = CURR_TIME - lastUpdate
        lastUpdate = CURR_TIME

        elapsedUpdate += DELTA_TIME_UPDATE

        // Update loop
        if (elapsedUpdate >= UPDATE_INTERVAL) {
            handleUpdate(ticker)

            elapsedUpdate = 0
        }

        // Render loop
        handleRender()
    })

    function handleUpdate(ticker: Ticker) {
        STATUS_BAR.update(ticker)
        STATS_ISLAND.update(ticker)
        const END =
            lifecycle.get() === lifespan.get() ||
            alive.get() === 0 ||
            crashed.get() + completed.get() === populationSize.get()

        switch (mode.get()) {
            case 'sim':
                if (END) {
                    POPULATION.evaluate()
                    POPULATION.selection()

                    restartSimulation()
                }

                //Globals.target.render(p);
                POPULATION.update()
                /* Globals.obstacles.forEach((obstacle) => {
                    obstacle.render(p);
                }); */

                lifecycle.increment()
                prevMode = 'sim'
                break
            case 'edit':
                /* Globals.target.render(p);

                Globals.obstacles.forEach((obstacle) => {
                    obstacle.render(p);
                    obstacle.mouseOver = obstacle.containsPoint(p.createVector(p.mouseX, p.mouseY));
                });

                p.mousePressed = () => {
                    Globals.obstacles.forEach((obstacle) => {
                        obstacle.mousePressed(p);
                    });
                    Globals.target.mousePressed(p);
                };

                Globals.obstacleToEdit?.edit(p); */

                prevMode = 'edit'
                break

            case 'stop':
                console.log(prevMode)
                /* if (prevMode !== 'stop') {
					resetGlobals()
				}

				Globals.target.render(p)
				Globals.obstacles.forEach((obstacle) => {
					obstacle.render(p)
				}) */
                prevMode = 'stop'
                break
        }
    }

    function handleRender() {
        POPULATION.render()
    }
})()
