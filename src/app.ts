import { Application } from 'pixi.js'

export const APP = new Application()

export function getStage() {
    return APP.stage
}
