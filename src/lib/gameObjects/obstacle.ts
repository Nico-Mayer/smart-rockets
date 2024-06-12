import { Container, FederatedPointerEvent, Graphics, Point } from 'pixi.js'
import { APP, OBSTACLE_STORE, darkMode, mode } from '../../globals'

const COLOR_DARK_MODE = 0xd3d3d3
const COLOR_LIGHT_MODE = 0x2b3440

type ObstacleState = 'static' | 'moving' | 'resizing' | 'rotating'

export interface ObstacleData {
    id: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
}

const SELECT_BOX_OFFSET = 10

let offsetX = 0
let offsetY = 0

export class Obstacle extends Container {
    data: ObstacleData
    graphic: Graphics
    selectBox: Graphics
    selected = false
    state: ObstacleState = 'static'

    constructor(data: ObstacleData) {
        super()
        this.data = data
        this.position = new Point(data.x, data.y)
        this.zIndex = 2
        this.eventMode = 'static'
        this.rotation = data.rotation
        this.pivot.set(data.width / 2, data.height / 2)
        this.graphic = this.setupGraphic()
        this.selectBox = this.setupSelectBox()

        APP.stage.addChild(this)

        // Signal listeners
        darkMode.addListener((isDarkMode) => this.onThemeChange(isDarkMode))
        mode.addListener((mode) => {
            if (mode === 'sim') this.unselect()
        })

        // Register events
        this.on('pointerdown', this.onDragStart)
        this.on('pointerup', this.onDragEnd)
        this.on('pointerupoutside', this.onDragEnd)
        this.on('click', this.onClick)
    }

    private setupGraphic(): Graphics {
        const GRAPHIC: Graphics = new Graphics()
        this.addChild(GRAPHIC)
        GRAPHIC.roundRect(0, 0, this.data.width, this.data.height, 10)
        GRAPHIC.fill({ color: darkMode.value ? COLOR_DARK_MODE : COLOR_LIGHT_MODE })
        return GRAPHIC
    }

    private setupSelectBox(): Graphics {
        const BOX = new Graphics()

        this.addChild(BOX)

        BOX.rect(
            0 - SELECT_BOX_OFFSET / 2,
            0 - SELECT_BOX_OFFSET / 2,
            this.data.width + SELECT_BOX_OFFSET,
            this.data.height + SELECT_BOX_OFFSET
        )
        BOX.stroke({ color: 0xff0000, width: 1 })
        BOX.visible = false
        return BOX
    }

    select() {
        this.selected = true
        this.selectBox.visible = true
    }

    unselect() {
        this.selected = false
        this.selectBox.visible = false
    }

    onClick() {
        if (mode.value !== 'edit') return
        this.select()
    }

    onDragStart(event: FederatedPointerEvent) {
        if (mode.value !== 'edit') return
        this.state = 'moving'
        this.alpha = 0.5

        offsetX = event.clientX - this.position.x
        offsetY = event.clientY - this.position.y

        this.on('pointermove', this.onDragMove)
    }

    onDragMove(event: FederatedPointerEvent) {
        if (mode.value !== 'edit') return

        this.position.x = event.clientX - offsetX
        this.position.y = event.clientY - offsetY

        OBSTACLE_STORE.updateObstacle(this.getData())
    }

    onDragEnd() {
        this.state = 'static'
        this.alpha = 1
        this.off('pointermove', this.onDragMove)
    }

    onThemeChange(isDarkMode: boolean) {
        this.graphic.clear()
        this.graphic.roundRect(0, 0, this.data.width, this.data.height, 10)
        this.graphic.fill({ color: isDarkMode ? COLOR_DARK_MODE : COLOR_LIGHT_MODE })
    }

    getData(): ObstacleData {
        return {
            id: this.data.id,
            x: this.position.x,
            y: this.position.y,
            width: this.data.width,
            height: this.data.height,
            rotation: this.rotation,
        } as ObstacleData
    }
}
