import { BitmapText, Graphics, MeshRope, Point, Sprite, Texture } from 'pixi.js'
import { TRAIL_ASSET, getStage } from '../app'
import {
    BASE_TRAIL_LENGTH,
    CAN_HEIGHT,
    CAN_WIDTH,
    OBSTACLES,
    SPAWN_POS,
    TARGET,
    darkMode,
    lifecycle,
    lifespan,
    rocketCollided,
    rocketCompleted,
    showDistance,
    showTargetLine,
    showTrail,
} from '../globals'
import { computePathPoints, pointDistance } from '../utils'
import { DNA } from './dna'

const FONT_LIGHT_COLOR = 0x86888a
const FONT_DARK_COLOR = 0x747678
const LINE_COLOR_BLOCKED = 0xfa5252
const LINE_COLOR_CLEAR = 0x69db7c

const COLOR_DEAD_LIGHT_MODE = 0x1b1b1f
const COLOR_DEAD_DARK_MODE = 0xf0f0f0
const COLOR_CRASHED = 0xfa6969

export class Rocket extends Sprite {
    dna: DNA
    lineToTarget: Graphics
    trail: MeshRope
    distText: BitmapText
    vel: Point = new Point(0, 0)
    acc: Point = new Point(0, 0)
    alive: boolean = true
    crashed: boolean = false
    completed: boolean = false
    fitness: number = 0
    history: Point[] = []
    moves: number = 0
    private colorChangeTimeoutID: number | null = null

    constructor(dna: DNA) {
        super(Texture.WHITE)
        this.dna = dna
        this.setupRocket()
        this.trail = this.setupTrail()
        this.distText = this.setupDistText()
        this.lineToTarget = this.setupLineToTarget()

        darkMode.addListener((isDarkMode) => {
            if (!this.distText) return
            this.distText.tint = isDarkMode ? FONT_LIGHT_COLOR : FONT_DARK_COLOR
        })
    }

    private setupRocket() {
        this.width = 25
        this.height = 5
        this.anchor.set(0.5)
        this.alpha = 0.7
        this.zIndex = 1
        this.tint = this.dna.bodyColor
        this.position = SPAWN_POS.clone()
        getStage().addChild(this)
    }

    removeFromStage() {
        const STAGE = getStage()
        STAGE.removeChild(this.lineToTarget)
        STAGE.removeChild(this.trail)
        STAGE.removeChild(this.distText)
        STAGE.removeChild(this)
    }

    update() {
        this.updateTrail()
        this.updateDistText()
        this.updateLineToTarget()

        if (!this.alive || this.crashed || this.completed) return

        this.vel = this.vel.add(this.acc)
        this.position = this.position.add(this.vel)
        this.acc.set(0, 0)

        if (lifecycle.get() < lifespan.get()) {
            this.applyForce(this.dna.genes[lifecycle.get()])
        }

        this.checkTargetHit()
        this.checkForCrash()
        this.moves++
    }

    render() {
        this.rotation = Math.atan2(this.vel.y, this.vel.x)
    }

    calcFitness() {
        const DIST_TO_TARGET = pointDistance(this.position, TARGET.position)
        const COMPLETED_BONUS = 10000
        const CRASH_PENALTY = 1500
        const WALL_PENALTY = 250
        const BASE_FITNESS = 1.0 / 16
        const FITNESS_SCALING_FACTOR = 1000

        const WALLS_BETWEEN_ROCKET_AND_TARGET = this.countWallsToTarget()

        if (this.completed) {
            this.fitness = BASE_FITNESS + COMPLETED_BONUS / Math.log(this.moves + 1)
        } else {
            this.fitness = 1 / Math.log(DIST_TO_TARGET + 1)
        }

        if (this.crashed) {
            this.fitness = this.fitness / Math.log(CRASH_PENALTY / this.moves + 1)
        }

        if (WALLS_BETWEEN_ROCKET_AND_TARGET > 0) {
            this.fitness =
                this.fitness / Math.log(WALL_PENALTY * WALLS_BETWEEN_ROCKET_AND_TARGET + 1)
        }

        this.fitness *= FITNESS_SCALING_FACTOR
    }

    /* calcFitness() {
        const DIST_TO_TARGET = pointDistance(this.position, TARGET.position)

        const COMPLETED_BONUS = 10000
        const CRASH_PENALTY = 1500
        const WALL_PENALTY = 250

        const WALLS_BETWEEN_ROCKET_AND_TARGET = this.countWallsToTarget()

        if (this.completed) {
            this.fitness = 1.0 / 16 + COMPLETED_BONUS / (this.moves * this.moves)
        } else {
            this.fitness = 1 / (DIST_TO_TARGET * DIST_TO_TARGET)
        }

        if (this.crashed) {
            this.fitness = this.fitness / (CRASH_PENALTY / this.moves)
        }

        if (WALLS_BETWEEN_ROCKET_AND_TARGET > 0) {
            this.fitness = this.fitness / (WALL_PENALTY * WALLS_BETWEEN_ROCKET_AND_TARGET)
        }
        this.fitness *= 1000
    } */

    reset() {
        this.completed = false
        this.crashed = false
        this.alive = true
        this.fitness = 0
        this.tint = this.dna.bodyColor
        this.position = SPAWN_POS.clone()
        this.alpha = 0.7
        this.moves = 0
        this.vel.set(0, 0)
        this.acc.set(0, 0)
        this.resetTrail()

        if (this.colorChangeTimeoutID) {
            clearTimeout(this.colorChangeTimeoutID)
            this.colorChangeTimeoutID = null
        }
    }

    private applyForce(force: Point) {
        this.acc = this.acc.add(force)
    }

    private checkForCrash() {
        const OUT_OF_BOUNDS =
            this.position.x < 0 ||
            this.position.x > CAN_WIDTH ||
            this.position.y < 0 ||
            this.position.y > CAN_HEIGHT
        const COLLIDED =
            OUT_OF_BOUNDS ||
            OBSTACLES.some((obstacle) =>
                obstacle.getBounds().containsPoint(this.position.x, this.position.y)
            )

        if (COLLIDED) {
            rocketCollided()
            this.tint = COLOR_CRASHED

            this.colorChangeTimeoutID = setTimeout(async () => {
                this.tint = darkMode.value ? COLOR_DEAD_DARK_MODE : COLOR_DEAD_LIGHT_MODE
                this.alpha = 0.3
            }, 800)
        }

        this.crashed = COLLIDED
        this.alive = !COLLIDED

        if (this.position.x < 0) this.position.x = 1
        if (this.position.x > CAN_WIDTH) this.position.x = CAN_WIDTH - 1
        if (this.position.y < 0) this.position.y = 1
        if (this.position.y > CAN_HEIGHT) this.position.y = CAN_HEIGHT - 1
    }

    private checkTargetHit() {
        const TARGET_BOUNDS = TARGET.getBounds()
        const TARGET_HIT = TARGET_BOUNDS.containsPoint(this.position.x, this.position.y)

        if (TARGET_HIT) {
            this.completed = true
            this.alive = false
            rocketCompleted()
        }
    }

    private pathToTargetIsClear(): boolean {
        const LINE_TO_TARGET = computePathPoints(this.position, TARGET.position)
        let clear = true

        for (let j = 0; j < OBSTACLES.length; j++) {
            const BOUNDS = OBSTACLES[j].getBounds()

            for (let i = 0; i < LINE_TO_TARGET.length; i++) {
                if (BOUNDS.containsPoint(LINE_TO_TARGET[i].x, LINE_TO_TARGET[i].y)) {
                    clear = false
                    break
                }
            }

            if (!clear) {
                break
            }
        }
        return clear
    }

    private countWallsToTarget(): number {
        const LINE_TO_TARGET = computePathPoints(this.position, TARGET.position)
        let wallCollision = 0

        OBSTACLES.forEach((obstacle) => {
            const BOUNDS = obstacle.getBounds()
            let collided = false

            for (let i = 0; i < LINE_TO_TARGET.length; i++) {
                if (BOUNDS.containsPoint(LINE_TO_TARGET[i].x, LINE_TO_TARGET[i].y)) {
                    collided = true
                }
            }
            if (collided) {
                wallCollision++
            }
        })

        return wallCollision
    }

    private setupLineToTarget(): Graphics {
        const LINE_TO_TARGET = new Graphics()
        return LINE_TO_TARGET
    }

    private updateLineToTarget() {
        const SHOULD_SHOW_LINE = showTargetLine.get() && this.alive
        const IS_ON_STAGE = this.lineToTarget.parent !== null

        if (SHOULD_SHOW_LINE) {
            if (!IS_ON_STAGE) {
                getStage().addChild(this.lineToTarget)
            }
            this.lineToTarget.clear()

            let lineColor = LINE_COLOR_BLOCKED
            if (this.pathToTargetIsClear()) {
                lineColor = LINE_COLOR_CLEAR
            }

            this.lineToTarget.moveTo(this.position.x, this.position.y)
            this.lineToTarget.lineTo(TARGET.position.x, TARGET.position.y)
            this.lineToTarget.stroke({ width: 2, color: lineColor, alpha: 0.2 })
        } else if (IS_ON_STAGE) {
            getStage().removeChild(this.lineToTarget)
        }
    }

    private setupDistText(): BitmapText {
        const DIST_TEXT = new BitmapText({ text: '0', style: { fontSize: 15 } })
        getStage().addChild(DIST_TEXT)
        DIST_TEXT.alpha = 0.7
        DIST_TEXT.zIndex = 0
        DIST_TEXT.tint = darkMode.value ? FONT_LIGHT_COLOR : FONT_DARK_COLOR
        return DIST_TEXT
    }

    private updateDistText() {
        const SHOULD_SHOW_TEXT =
            (showDistance.get() || this.dna.isBest) && this.alive && !this.completed
        const IS_ON_STAGE = this.distText.parent !== null
        const UPDATE_INTERVAL = 10

        const X_OFFSET = 10
        const Y_OFFSET = -10

        if (SHOULD_SHOW_TEXT) {
            if (!IS_ON_STAGE) {
                getStage().addChild(this.distText)
            }
            this.distText.position.set(this.position.x + X_OFFSET, this.position.y + Y_OFFSET)

            if (this.moves % UPDATE_INTERVAL !== 0) return
            this.distText.text = Math.floor(
                pointDistance(this.position, TARGET.position)
            ).toString()
        } else if (IS_ON_STAGE) {
            getStage().removeChild(this.distText)
        }
    }

    private setupTrail(): MeshRope {
        this.history = Array(BASE_TRAIL_LENGTH).fill(this.position.clone())
        const TRAIL = new MeshRope({ texture: TRAIL_ASSET, points: this.history })
        TRAIL.alpha = 0.35
        TRAIL.tint = this.dna.trailColor
        TRAIL.zIndex = 0
        getStage().addChild(TRAIL)
        return TRAIL
    }

    private updateTrail() {
        const SHOULD_SHOW_TRAIL = showTrail.get()
        const IS_ON_STAGE = this.trail.parent !== null

        if (SHOULD_SHOW_TRAIL) {
            if (!IS_ON_STAGE) {
                this.history.fill(this.position.clone())
                getStage().addChild(this.trail)
            }

            this.history.push(this.position.clone())
            if (this.history.length > BASE_TRAIL_LENGTH) {
                this.history.shift()
            }
        } else if (IS_ON_STAGE) {
            getStage().removeChild(this.trail)
        }
    }

    private resetTrail() {
        this.trail.tint = this.dna.trailColor
        this.history.fill(SPAWN_POS.clone())
    }
}
