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
    repositionHandle: RepositionHandle
    rotationHandle: RotationHandle
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
        this.rotationHandle = new RotationHandle(this)
        this.repositionHandle = new RepositionHandle(this)

        APP.stage.addChild(this)

        // Signal listeners
        darkMode.addListener((isDarkMode) => this.onThemeChange(isDarkMode))
        mode.addListener((mode) => {
            switch (mode) {
                case 'sim':
                    this.unselect()
                    this.rotationHandle.visible = false
                    this.repositionHandle.visible = false
                    break
                case 'edit':
                    this.rotationHandle.visible = true
                    this.repositionHandle.visible = true
                    break
            }
        })
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

class RotationHandle extends Graphics {
    obstacle: Obstacle
    offsetY: number = -30
    handleSize: number = 10
    constructor(obstacle: Obstacle) {
        super()
        this.obstacle = obstacle
        this.eventMode = 'static'
        this.roundRect(
            obstacle.width / 2 - this.handleSize / 2,
            this.offsetY,
            this.handleSize,
            this.handleSize,
            10
        )
        this.stroke({ color: 0x00ff00, width: 1 })
        this.fill({ color: 0x00ff00, alpha: 0.5 })
        this.visible = false

        this.obstacle.addChild(this)

        this.on('pointerdown', this.onDragStart)
        this.on('pointerupoutside', this.onDragEnd)
        this.on('pointerup', this.onDragEnd)
    }

    onDragStart() {
        this.obstacle.state = 'rotating'
        APP.stage.on('pointermove', this.onDragMove, this.obstacle)
    }

    onDragMove(event: FederatedPointerEvent) {
        if (mode.value !== 'edit') return
        const ANGLE = Math.atan2(event.clientY - this.y, event.clientX - this.x)
        const ADJUSTED_ANGLE = ANGLE + Math.PI / 2

        this.rotation = ADJUSTED_ANGLE
    }

    onDragEnd() {
        this.obstacle.state = 'static'
        APP.stage.off('pointermove', this.onDragMove)
    }
}

class RepositionHandle extends Graphics {
    obstacle: Obstacle
    offset: number = 5
    constructor(obstacle: Obstacle) {
        super()
        this.obstacle = obstacle
        this.eventMode = 'static'
        this.roundRect(
            this.offset,
            this.offset,
            this.obstacle.width - this.offset * 2,
            this.obstacle.height - this.offset * 2,
            10
        )
        this.stroke({ color: 0x00ff00, width: 1 })
        this.fill({ color: 0xfff, alpha: 0 })
        this.visible = false
        this.obstacle.addChild(this)

        this.on('pointerdown', this.onDragStart, this)
        this.on('pointerupoutside', this.onDragEnd)
        this.on('pointerup', this.onDragEnd)
    }

    onDragStart(event: FederatedPointerEvent) {
        console.log('onDragStart')
        if (mode.value !== 'edit') return
        this.obstacle.select()
        this.obstacle.state = 'moving'
        this.obstacle.alpha = 0.5

        offsetX = event.clientX - this.obstacle.position.x
        offsetY = event.clientY - this.obstacle.position.y

        APP.stage.on('pointermove', this.onDragMove, this)
    }

    onDragMove(event: FederatedPointerEvent) {
        if (mode.value !== 'edit') return
        this.obstacle.position.x = event.clientX - offsetX
        this.obstacle.position.y = event.clientY - offsetY

        OBSTACLE_STORE.updateObstacle(this.obstacle.getData())
    }

    onDragEnd() {
        this.obstacle.state = 'static'
        this.obstacle.alpha = 1
        APP.stage.off('pointermove', this.onDragMove)
    }
}
