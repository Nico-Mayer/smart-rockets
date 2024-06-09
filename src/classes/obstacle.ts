import { Point, Sprite, Texture } from 'pixi.js'
import { getStage } from '../app'
import { darkMode } from '../globals'

const LIGHT_COLOR = 0x86888a
const DARK_COLOR = 0x747678

export class Obstacle extends Sprite {
    constructor(position: Point, width: number, height: number) {
        super(Texture.WHITE)
        this.width = width
        this.height = height
        this.tint = darkMode.value ? LIGHT_COLOR : DARK_COLOR
        // this.alpha = 0.8
        this.anchor.set(0.5)
        this.zIndex = 2
        this.position = position
        getStage().addChild(this)

        darkMode.addListener((isDarkMode) => {
            this.tint = isDarkMode ? LIGHT_COLOR : DARK_COLOR
        })
    }

    update() {
        this.rotation += 0.01
    }
}
