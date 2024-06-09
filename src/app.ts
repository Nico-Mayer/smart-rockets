import { Application, Assets } from 'pixi.js'

export const APP = new Application()

export function getStage() {
    return APP.stage
}

export const TRAIL_ASSET = await Assets.load('trail.png')
