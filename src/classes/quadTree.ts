import { Graphics, Point, Rectangle } from 'pixi.js'
import { darkMode } from '../globals'

const COLOR_LIGHT = 0xa5d8ff
const COLOR_DARK = 0x154163

export class QuadTree {
    public points: Point[] = []
    public boundary: Rectangle
    public capacity: number
    public divided: boolean = false
    public topLeft: QuadTree | null = null
    public topRight: QuadTree | null = null
    public bottomLeft: QuadTree | null = null
    public bottomRight: QuadTree | null = null

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary
        this.capacity = capacity
    }

    insert(point: Point): boolean {
        if (!this.boundary.contains(point.x, point.y)) return false

        if (this.points.length < this.capacity && !this.divided) {
            this.points.push(point)
            return true
        } else {
            if (!this.divided) {
                this.subdivide()
            }
            if (this.topLeft?.insert(point)) return true
            if (this.topRight?.insert(point)) return true
            if (this.bottomLeft?.insert(point)) return true
            if (this.bottomRight?.insert(point)) return true
        }
        return false
    }

    subdivide() {
        const { x: X, y: Y, width: WIDTH, height: HEIGHT } = this.boundary
        const HALF_WIDTH = WIDTH / 2
        const HALF_HEIGHT = HEIGHT / 2

        const TL_BOUNDRAY = new Rectangle(X, Y, HALF_WIDTH, HALF_HEIGHT)
        const TR_BOUNDRAY = new Rectangle(X + HALF_WIDTH, Y, HALF_WIDTH, HALF_HEIGHT)
        const BL_BOUNDRAY = new Rectangle(X, Y + HALF_HEIGHT, HALF_WIDTH, HALF_HEIGHT)
        const BR_BOUNDRAY = new Rectangle(X + HALF_WIDTH, Y + HALF_HEIGHT, HALF_WIDTH, HALF_HEIGHT)

        this.topLeft = new QuadTree(TL_BOUNDRAY, this.capacity)
        this.topRight = new QuadTree(TR_BOUNDRAY, this.capacity)
        this.bottomLeft = new QuadTree(BL_BOUNDRAY, this.capacity)
        this.bottomRight = new QuadTree(BR_BOUNDRAY, this.capacity)

        this.divided = true

        for (const POINT of this.points) {
            this.topLeft.insert(POINT) ||
                this.topRight.insert(POINT) ||
                this.bottomLeft.insert(POINT) ||
                this.bottomRight.insert(POINT)
        }
        this.points = []
    }

    show(graphics: Graphics) {
        const { x: X, y: Y, width: WIDTH, height: HEIGHT } = this.boundary
        graphics.rect(X, Y, WIDTH, HEIGHT)
        graphics.stroke({ width: 1, color: darkMode.value ? COLOR_DARK : COLOR_LIGHT })

        if (this.divided) {
            this.topLeft?.show(graphics)
            this.topRight?.show(graphics)
            this.bottomLeft?.show(graphics)
            this.bottomRight?.show(graphics)
        }
    }
}
