import { Point, Sprite, Texture } from 'pixi.js'
import { getStage } from '../app'

export class Obstacle extends Sprite {
    constructor(position: Point, width: number, height: number) {
        super(Texture.WHITE)
        this.width = width
        this.height = height
        this.tint = '#d3d3d3'
        this.anchor.set(0.5)
        this.zIndex = 2
        this.position = position
        getStage().addChild(this)
    }

    update() {
        this.rotation += 0.01
    }
}
