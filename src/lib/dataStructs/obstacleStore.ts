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
        let localData: ObstacleData[] | null

        try {
            localData = JSON.parse(localStorage.getItem(this._key)!)
        } catch (e) {
            console.error(e)
            localData = DEFAULT_OBS_DATA
        }

        const LOCAL_DATA_IS_VALID = this.validateLocalStorageData(localData)
        if (!LOCAL_DATA_IS_VALID || localData?.length === 0 || localData === null) {
            this.obstacleData = [...DEFAULT_OBS_DATA]
            this.persistData()
            this.obstacles = this.obstacleData.map((data) => {
                return new Obstacle(data)
            })
        } else {
            this.obstacleData = localData
            this.obstacles = this.obstacleData.map((data) => {
                return new Obstacle(data)
            })
        }
    }

    persistData(): void {
        if (this.obstacleData.length === 0) return
        localStorage.setItem(this._key, JSON.stringify(this.obstacleData))
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

    validateLocalStorageData(data: unknown): data is ObstacleData[] {
        if (!Array.isArray(data)) return false

        return data.every((obs) => this.validateObstacleData(obs))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateObstacleData(data: any): data is ObstacleData {
        return (
            typeof data === 'object' &&
            typeof data.id === 'string' &&
            typeof data.x === 'number' &&
            typeof data.y === 'number' &&
            typeof data.width === 'number' &&
            typeof data.height === 'number' &&
            typeof data.rotation === 'number'
        )
    }
}
