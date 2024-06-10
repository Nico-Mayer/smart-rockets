import { Point, Sprite, Texture } from 'pixi.js'
import { getStage } from '../app'
import { OBSTACLE_STORE, darkMode, mode } from '../globals'

const COLOR_DARK_MODE = 0x868686
const COLOR_LIGHT_MODE = 0x787878

export interface ObstacleData {
    id: string
    x: number
    y: number
    width: number
    height: number
}

export class Obstacle extends Sprite {
    id: string
    selected: boolean = false

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

        getStage().addChild(this)

        this.eventMode = 'static'
        this.on('pointerdown', this.handelPointerDown)

        darkMode.addListener((isDarkMode) => {
            this.tint = isDarkMode ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        })
    }

    update() {
        if (this.selected) {
            this.tint = 0xff0000
        } else {
            this.tint = darkMode.value ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        }
    }

    handelPointerDown() {
        if (mode.value !== 'edit') return
        this.selected = true

        this.on('mousemove', (event) => {
            if (!this.selected) return
            this.position = event.client
            OBSTACLE_STORE?.editObstacle(this.getData())
        })

        this.on('mouseup', () => {
            console.log('mouseupcature')
            this.selected = false
        })
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
