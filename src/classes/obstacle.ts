import { Point, Sprite, Texture } from 'pixi.js'
import { getStage } from '../app'
import { darkMode } from '../globals'

const COLOR_DARK_MODE = 0x868686
const COLOR_LIGHT_MODE = 0x787878

export class Obstacle extends Sprite {
    constructor(position: Point, width: number, height: number) {
        super(Texture.WHITE)
        this.width = width
        this.height = height
        this.tint = darkMode.value ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        // this.alpha = 0.8
        this.anchor.set(0.5)
        this.zIndex = 2
        this.position = position

        getStage().addChild(this)

        /* this.eventMode = "static"
		this.on("pointerdown", () => {
			console.log("Obstacle clicked")
		}) */

        darkMode.addListener((isDarkMode) => {
            this.tint = isDarkMode ? COLOR_DARK_MODE : COLOR_LIGHT_MODE
        })
    }

    update() {
        this.rotation += 1
    }
}
