import { Assets, Sprite } from 'pixi.js'

export class Target extends Sprite {
    constructor(x: number, y: number) {
        super()

        this.x = x
        this.y = y
        this.anchor = 0.5
        this.scale = 0.5

        this.loadTexture()
    }

    private async loadTexture() {
        this.texture = await Assets.load('../../assets/target.svg')
    }
}
