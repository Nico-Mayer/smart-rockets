import { v4 as uuidv4 } from 'uuid'
import { Obstacle, ObstacleData } from '../gameObjects/obstacle'

const DEFAULT_OBS_DATA: ObstacleData[] = [
    {
        id: uuidv4(),
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        width: 500,
        height: 100,
        rotation: 0,
    },
]

export class ObstacleStore {
    private _key: string = 'obstacleData'
    private obstacleData: ObstacleData[] = []
    obstacles: Obstacle[] = []

    constructor() {
        this.obstacleData = JSON.parse(localStorage.getItem(this._key)!) || []

        if (this.obstacleData.length === 0) {
            this.obstacleData = [...DEFAULT_OBS_DATA]
            localStorage.setItem(this._key, JSON.stringify(this.obstacleData))
        }
        this.obstacles = this.obstacleData.map((data) => {
            return new Obstacle(data)
        })
    }

    addObstacle(obstacle: Obstacle): void {
        this.obstacles.push(obstacle)
        this.obstacleData.push(obstacle.getData())
        localStorage.setItem(this._key, JSON.stringify(this.obstacleData))
    }

    updateObstacle(obstacle: ObstacleData): void {
        const INDEX = this.obstacleData.findIndex((obs) => obs.id === obstacle.id)
        this.obstacleData[INDEX] = obstacle

        localStorage.setItem(this._key, JSON.stringify(this.obstacleData))
    }
}
