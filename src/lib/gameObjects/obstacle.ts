import { Point, Sprite, Texture } from 'pixi.js'
import { APP, OBSTACLE_STORE, darkMode } from '../../globals'

const COLOR_DARK_MODE = 0xd3d3d3
const COLOR_LIGHT_MODE = 0xd3d3d3

type ObstacleState = 'static' | 'selected' | 'moving' | 'resizing' | 'rotating'

export interface ObstacleData {
    id: string
    x: number
    y: number
    width: number
    height: number
}

export class Obstacle extends Sprite {
    id: string
    state: ObstacleState = 'static'

    constructor(data: ObstacleData) {
        super(Texture.WHITE)
        this.id = data.id
        this.width = data.width
        this.height = data.height
        this.tint = darkMode.value ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        // this.alpha = 0.8
        this.anchor.set(0.5)
        this.zIndex = 2
        this.position = new Point(data.x, data.y)

        APP.stage.addChild(this)

        this.eventMode = 'static'

        darkMode.addListener((isDarkMode) => {
            this.tint = isDarkMode ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        })

        // Register events

        this.on('pointerdown', this.onDragStart)
        this.on('pointerup', this.onDragEnd)
        this.on('pointerupoutside', this.onDragEnd)
    }

    update() {
        switch (this.state) {
            case 'selected':
                this.tint = 0xff0000
                break
            case 'moving':
                this.tint = 0x00ff00
                break
            default:
                this.tint = darkMode.value ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
                break
        }
    }

    onDragStart() {
        this.state = 'moving'
        this.alpha = 0.5

        this.on('pointermove', this.onDragMove)
    }

    onDragMove(event: PointerEvent) {
        this.position.x = event.clientX
        this.position.y = event.clientY
        OBSTACLE_STORE.updateObstacle(this.getData())
    }

    onDragEnd() {
        this.state = 'static'
        this.alpha = 1
        this.off('pointermove', this.onDragMove)
    }

    getData(): ObstacleData {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        }
    }
}
